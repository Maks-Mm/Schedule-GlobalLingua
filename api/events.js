"use strict";
//api/events.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const redis_1 = require("../lib/redis");
async function handler(req, res) {
    if (req.method !== "GET")
        return res.status(405).end();
    const raw = await redis_1.redis.lrange("events", 0, -1);
    const events = raw
        .map((e) => (typeof e === "string" ? JSON.parse(e) : e))
        .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
    res.json(events);
}
