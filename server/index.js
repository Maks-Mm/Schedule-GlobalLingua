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
const app = (0, express_1.default)();
const DATA_FILE = path_1.default.join(__dirname, "../events.json");
// Load existing events from file
let events = [];
try {
    if (fs_1.default.existsSync(DATA_FILE)) {
        const data = fs_1.default.readFileSync(DATA_FILE, "utf-8");
        if (data && data.trim()) {
            try {
                events = JSON.parse(data);
                console.log(`📂 Loaded ${events.length} events from file`);
            }
            catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                events = [];
            }
        }
        else {
            console.log("📂 Events file is empty");
            events = [];
        }
    }
    else {
        console.log("📂 No events file found, creating new one");
        events = [];
    }
}
catch (err) {
    console.error("Error loading events file:", err);
    events = [];
}
// Save events to file
function saveEventsToFile() {
    try {
        fs_1.default.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2), "utf8");
        console.log(`💾 Saved ${events.length} events to file`);
    }
    catch (err) {
        console.error("Error saving events:", err);
    }
}
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
}));
app.use(express_1.default.json());
// Simplified validation for debugging
function validateEvent(event) {
    const errors = [];
    console.log("Validating event:", event); // Debug log
    if (!event.title || typeof event.title !== 'string' || event.title.trim().length === 0) {
        errors.push('Title is required');
    }
    if (!event.datetime) {
        errors.push('Date & time is required');
    }
    else {
        // Try to parse the date
        try {
            const date = new Date(event.datetime);
            if (isNaN(date.getTime())) {
                errors.push('Invalid date format');
            }
        }
        catch (e) {
            errors.push('Invalid date format');
        }
    }
    return errors;
}
app.get("/", (_, res) => {
    res.send("OK");
});
app.post("/api/create-event", async (req, res) => {
    try {
        const rawEvent = req.body;
        console.log("Received raw event:", rawEvent); // Debug log
        // Validate event data
        const validationErrors = validateEvent(rawEvent);
        if (validationErrors.length > 0) {
            console.error("Validation errors:", validationErrors);
            return res.status(400).json({
                ok: false,
                error: "Validation failed",
                details: validationErrors
            });
        }
        // Clean and normalize event data
        const newEvent = {
            id: Date.now(),
            title: rawEvent.title.trim(),
            teacher: rawEvent.teacher?.trim() || '',
            student: rawEvent.student?.trim() || '',
            datetime: new Date(rawEvent.datetime).toISOString(),
            channel: rawEvent.channel || 'zoom',
            account: rawEvent.account?.trim() || '',
            address: rawEvent.address?.trim() || '',
            status: "scheduled",
            createdAt: new Date().toISOString(),
            emailSent: false
        };
        console.log("📝 Created event:", {
            title: newEvent.title,
            teacher: newEvent.teacher,
            student: newEvent.student,
            datetime: newEvent.datetime
        });
        // Send email notification
        try {
            await (0, email_1.sendEmail)(newEvent);
            console.log("📧 Email sent successfully");
            newEvent.emailSent = true;
            newEvent.emailSentAt = new Date().toISOString();
        }
        catch (emailError) {
            console.error("⚠️ Email failed but event saved:", emailError);
        }
        // Store in memory and file
        events.push(newEvent);
        saveEventsToFile();
        console.log(`💾 Event saved (${events.length} total events)`);
        res.json({ ok: true, id: newEvent.id });
    }
    catch (e) {
        console.error("❌ SERVER ERROR:", e);
        res.status(500).json({ ok: false, error: String(e) });
    }
});
app.get("/api/events", (req, res) => {
    const sortedEvents = [...events].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
    res.json(sortedEvents);
});
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ API running on http://localhost:${PORT}`);
    console.log("📧 Email notifications: ENABLED");
    console.log("💾 Storage: JSON file (persistent)");
    console.log(`📁 Data file: ${DATA_FILE}`);
    console.log(`📊 Current events: ${events.length}`);
});
