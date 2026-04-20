"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendEmail(event) {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false // Add this to bypass certificate validation
        }
    });
    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.RECEIVER_EMAIL,
        subject: `Booked lesson: ${event.title}`,
        html: `
      <h3>New Booking Confirmation</h3>
      <p><strong>Title:</strong> ${event.title}</p>
      <p><strong>Teacher:</strong> ${event.teacher || 'Not specified'}</p>
      <p><strong>Student:</strong> ${event.student || 'Not specified'}</p>
      <p><strong>Date & Time:</strong> ${event.datetime}</p>
      <p><strong>Channel:</strong> ${event.channel}</p>
      <p><strong>Account:</strong> ${event.account || 'Not specified'}</p>
      <p><strong>Address:</strong> ${event.address || 'Not specified'}</p>
    `
    });
}
