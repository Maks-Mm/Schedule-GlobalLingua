import "dotenv/config";
import express from "express";
import cors from "cors";
import { sendEmail } from "../lib/email";
import fs from "fs";
import path from "path";

const app = express();
const DATA_FILE = path.join(__dirname, "../events.json");

// Define the Event interface
interface Event {
  id: number;
  title: string;
  teacher: string;
  student: string;
  datetime: string;
  channel: string;
  account: string;
  address: string;
  status: string;
  createdAt: string;
  emailSent: boolean;
  emailSentAt?: string;
}

// Load existing events from file
let events: Event[] = [];
try {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    if (data && data.trim()) {
      try {
        events = JSON.parse(data);
        console.log(`📂 Loaded ${events.length} events from file`);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        events = [];
      }
    } else {
      console.log("📂 Events file is empty");
      events = [];
    }
  } else {
    console.log("📂 No events file found, creating new one");
    events = [];
  }
} catch (err) {
  console.error("Error loading events file:", err);
  events = [];
}

// Save events to file
function saveEventsToFile() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2), "utf8");
    console.log(`💾 Saved ${events.length} events to file`);
  } catch (err) {
    console.error("Error saving events:", err);
  }
}

app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(express.json());

// Simplified validation for debugging
function validateEvent(event: any) {
  const errors = [];
  
  console.log("Validating event:", event); // Debug log
  
  if (!event.title || typeof event.title !== 'string' || event.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!event.datetime) {
    errors.push('Date & time is required');
  } else {
    // Try to parse the date
    try {
      const date = new Date(event.datetime);
      if (isNaN(date.getTime())) {
        errors.push('Invalid date format');
      }
    } catch (e) {
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
    const newEvent: Event = {
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
      await sendEmail(newEvent);
      console.log("📧 Email sent successfully");
      newEvent.emailSent = true;
      newEvent.emailSentAt = new Date().toISOString();
    } catch (emailError) {
      console.error("⚠️ Email failed but event saved:", emailError);
    }
    
    // Store in memory and file
    events.push(newEvent);
    saveEventsToFile();
    
    console.log(`💾 Event saved (${events.length} total events)`);
    
    res.json({ ok: true, id: newEvent.id });
  } catch (e) {
    console.error("❌ SERVER ERROR:", e);
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.get("/api/events", (req, res) => {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );
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