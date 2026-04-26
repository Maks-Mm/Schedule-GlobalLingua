//api/events.ts

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { redis } from "../lib/redis";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const raw = await redis.lrange("events", 0, -1);

  const events = raw
    .map((e) => (typeof e === "string" ? JSON.parse(e) : e))
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

  res.json(events);
}