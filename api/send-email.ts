//api/send-email.ts

 import type { IncomingMessage, ServerResponse } from "http";
import nodemailer from "nodemailer";

export default async function handler(
  req: IncomingMessage & { body?: any },
  res: ServerResponse
) {
  console.log("EMAIL API HIT");

  const { title, teacher, student, datetime, channel } =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: `Booked lesson: ${title}`,
      html: `
        <h3>New booking</h3>
        <p>${title}</p>
        <p>${teacher}</p>
        <p>${student}</p>
        <p>${datetime}</p>
        <p>${channel}</p>
      `
    });

    console.log("EMAIL SENT:", info.messageId);

    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false }));
  }
}