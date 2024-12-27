import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  reminder: { type: Date, required: true },
  message: { type: String, required: true },
});

export const ReminderModel = mongoose.model("Reminder", reminderSchema);
