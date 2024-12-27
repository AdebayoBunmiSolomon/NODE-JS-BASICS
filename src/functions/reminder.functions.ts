import { ReminderModel } from "../model/reminder.db";

export const getAllReminder = () => ReminderModel.find();
export const createAReminder = (values: Record<string, any>) =>
  new ReminderModel(values).save().then((reminder) => reminder.toObject()); // create a reminder
