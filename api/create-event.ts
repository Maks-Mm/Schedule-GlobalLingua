//aps/create-event.ts

import type { IncomingMessage, ServerResponse } from "http";
import clientPromise from "../lib/db";
import { sendEmail } from "../lib/email";

export default async function handler(
  req: IncomingMessage & { body?: any; method?: string },
  res: ServerResponse & { status: (code: number) => any; json: (data: any) => any }
) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end();
  }

  const event =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  const client = await clientPromise;
  const db = client.db("automized-informig-by-email-global-lingua");

  await db.collection("events").insertOne({
    ...event,
    createdAt: new Date()
  });

  try {
    await sendEmail(event);
  } catch (e) {
    console.error("EMAIL ERROR:", e);
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true }));
}