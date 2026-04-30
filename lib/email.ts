import nodemailer from "nodemailer";

export async function sendEmail(event: any) {
  console.log("Preparing to send email for event:", event.title);
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    },
    tls: {
      rejectUnauthorized: false  // This fixes the certificate error
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: `📚 New Booking: ${event.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { padding: 20px; background-color: #f5f5f5; }
          .header { background-color: #4caf50; color: white; padding: 10px; }
          .content { background-color: white; padding: 20px; margin-top: 10px; }
          .field { margin: 10px 0; }
          .label { font-weight: bold; color: #333; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Lesson Booking</h2>
          </div>
          <div class="content">
            <div class="field"><span class="label">Title:</span> ${event.title}</div>
            <div class="field"><span class="label">Teacher:</span> ${event.teacher || 'Not specified'}</div>
            <div class="field"><span class="label">Student:</span> ${event.student || 'Not specified'}</div>
            <div class="field"><span class="label">Date & Time:</span> ${event.datetime}</div>
            <div class="field"><span class="label">Channel:</span> ${event.channel}</div>
            <div class="field"><span class="label">Account:</span> ${event.account || 'Not specified'}</div>
            <div class="field"><span class="label">Address:</span> ${event.address || 'Not specified'}</div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email failed:", error);
    throw error;
  }
}