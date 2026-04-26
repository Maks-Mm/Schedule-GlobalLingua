//api/create-event.ts

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { redis } from "../lib/redis";
import { sendEmail } from "../lib/email";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const raw = req.body;

  if (!raw.title?.trim()) {
    return res.status(400).json({ ok: false, error: "Title is required" });
  }
  if (!raw.datetime || isNaN(new Date(raw.datetime).getTime())) {
    return res.status(400).json({ ok: false, error: "Valid datetime is required" });
  }

  const event = {
    id: Date.now(),
    title: raw.title.trim(),
    teacher: raw.teacher?.trim() || "",
    student: raw.student?.trim() || "",
    datetime: new Date(raw.datetime).toISOString(),
    channel: raw.channel || "zoom",
    account: raw.account?.trim() || "",
    address: raw.address?.trim() || "",
    status: "scheduled",
    createdAt: new Date().toISOString(),
    emailSent: false,
    emailSentAt: undefined as string | undefined,
  };

  try {
    await sendEmail(event);
    event.emailSent = true;
    event.emailSentAt = new Date().toISOString();
  } catch (e) {
    console.error("Email failed:", e);
  }

  // Store in Redis as a list
  await redis.lpush("events", JSON.stringify(event));

  res.json({ ok: true, id: event.id });
}