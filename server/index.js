"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const email_1 = require("../lib/email");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = require("../lib/db");
const app = (0, express_1.default)();
const DATA_FILE = path_1.default.join(__dirname, "../events.json");
app.post("/api/create-event", async (req, res) => {
    try {
        const db = await (0, db_1.getDB)();
        const collection = db.collection("events");
        const result = await collection.insertOne({
            ...req.body,
            createdAt: new Date()
        });
        res.json({ ok: true, id: result.insertedId });
    }
    catch (e) {
        res.status(500).json({ ok: false });
    }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Load existing events from file
let events = [];
try {
    if (fs_1.default.existsSync(DATA_FILE)) {
        const data = fs_1.default.readFileSync(DATA_FILE, "utf-8");
        events = JSON.parse(data);
        console.log(`📂 Loaded ${events.length} events from file`);
    }
}
catch (err) {
    console.error("Error loading events file:", err);
}
// Save events to file
function saveEventsToFile() {
    try {
        fs_1.default.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));
        console.log(`💾 Saved ${events.length} events to file`);
    }
    catch (err) {
        console.error("Error saving events:", err);
    }
}
app.post("/api/create-event", async (req, res) => {
    try {
        const event = req.body;
        console.log("📝 Received event:", {
            title: event.title,
            teacher: event.teacher,
            student: event.student,
            datetime: event.datetime
        });
        // Store in memory and file
        const newEvent = {
            ...event,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };
        events.push(newEvent);
        saveEventsToFile();
        console.log(`💾 Event saved (${events.length} total events)`);
        // Send email notification
        try {
            await (0, email_1.sendEmail)(event);
            console.log("📧 Email sent successfully");
        }
        catch (emailError) {
            console.error("⚠️ Email failed but event saved:", emailError);
        }
        res.json({ ok: true, id: newEvent.id });
    }
    catch (e) {
        console.error("❌ SERVER ERROR:", e);
        res.status(500).json({ ok: false, error: String(e) });
    }
});
app.get("/api/events", (req, res) => {
    res.json(events);
});
app.listen(3001, () => {
    console.log("✅ API running on http://localhost:3001");
    console.log("📧 Email notifications: ENABLED");
    console.log("💾 Storage: JSON file (persistent)");
    console.log(`📁 Data file: ${DATA_FILE}`);
});
