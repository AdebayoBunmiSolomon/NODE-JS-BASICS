import cron from "node-cron";
import nodemailer from "nodemailer";
import { getAllReminder } from "../functions/reminder.functions";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "ptechnologiez@gmail.com",
    pass: "fxdm tucl nfsm pebl",
  },
});

// Cron job to run every minute
cron.schedule("* * * * *", async () => {
  console.log("Running cron job to check reminders...");

  try {
    const now = new Date();
    const reminders = await getAllReminder();

    if (!reminders || reminders.length === 0) {
      console.log("No reminders stored in the database.");
      return;
    }

    // Check each reminder
    for (const reminder of reminders) {
      // Compare the reminder time with the current time within the same minute
      const reminderTime = new Date(reminder.reminder);
      if (
        reminderTime.getFullYear() === now.getFullYear() &&
        reminderTime.getMonth() === now.getMonth() &&
        reminderTime.getDate() === now.getDate() &&
        reminderTime.getHours() === now.getHours() &&
        reminderTime.getMinutes() === now.getMinutes()
      ) {
        // Send the email
        const mailOptions = {
          from: "Node.js Basics Reminder <no-reply@example.com>",
          to: reminder.email,
          subject: "Reminder Notification",
          text: reminder.message,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Email sent to ${reminder.email}`);
        } catch (err) {
          console.error(`Failed to send email to ${reminder.email}:`, err);
        }
      }
    }
  } catch (err: any) {
    console.error("Error processing cron-job request:", err);
  }
});
