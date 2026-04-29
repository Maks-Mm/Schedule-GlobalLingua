"use strict";
//api/create-event.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const redis_1 = require("../lib/redis");
const email_1 = require("../lib/email");
async function handler(req, res) {
    if (req.method !== "POST")
        return res.status(405).end();
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
        emailSentAt: undefined,
    };
    try {
        await (0, email_1.sendEmail)(event);
        event.emailSent = true;
        event.emailSentAt = new Date().toISOString();
    }
    catch (e) {
        console.error("Email failed:", e);
    }
    // Store in Redis as a list
    await redis_1.redis.lpush("events", JSON.stringify(event));
    res.json({ ok: true, id: event.id });
}
