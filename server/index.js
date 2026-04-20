"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("../lib/db"));
const email_1 = require("../lib/email");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/api/create-event", async (req, res) => {
    try {
        console.log("Received event:", req.body);
        // Connect to MongoDB
        const client = await db_1.default;
        const db = client.db("automized-informig-by-email-global-lingua");
        const event = req.body;
        const result = await db.collection("events").insertOne({
            ...event,
            createdAt: new Date()
        });
        console.log("Saved to MongoDB with ID:", result.insertedId);
        // Send email
        try {
            await (0, email_1.sendEmail)(event);
            console.log("Email sent successfully");
        }
        catch (emailError) {
            console.error("Email failed but data saved to MongoDB:", emailError);
        }
        res.json({ ok: true, id: result.insertedId });
    }
    catch (e) {
        console.error("SERVER ERROR:", e);
        res.status(500).json({ ok: false, error: String(e) });
    }
});
app.get("/api/events", async (req, res) => {
    try {
        const client = await db_1.default;
        const db = client.db("automized-informig-by-email-global-lingua");
        const events = await db.collection("events").find({}).toArray();
        res.json(events);
    }
    catch (e) {
        console.error("Error fetching events:", e);
        res.status(500).json({ ok: false });
    }
});
app.listen(3001, () => {
    console.log("✅ API running on 3001 with MongoDB");
    console.log("📧 Email notifications active");
});
