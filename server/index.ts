import "dotenv/config";
import express from "express";
import cors from "cors";
import { sendEmail } from "../lib/email";

const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage
const events: any[] = [];

app.post("/api/create-event", async (req, res) => {
  try {
    const event = req.body;
    
    console.log("📝 Received event:", {
      title: event.title,
      teacher: event.teacher,
      student: event.student,
      datetime: event.datetime
    });
    
    // Store in memory
    const newEvent = {
      ...event,
      id: Date.now(),
      createdAt: new Date()
    };
    events.push(newEvent);
    
    console.log(`💾 Event saved (${events.length} total events)`);

    // Send email notification
    try {
      await sendEmail(event);
      console.log("📧 Email sent successfully");
    } catch (emailError) {
      console.error("⚠️ Email failed but event saved:", emailError);
    }

    res.json({ ok: true, id: newEvent.id });
  } catch (e) {
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
  console.log("💾 Storage: In-memory (data lost on restart)");
});