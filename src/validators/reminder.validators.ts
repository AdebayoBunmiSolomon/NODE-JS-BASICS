import Joi from "joi";
import { ICreateReminder } from "../interface/reminder.interface";

export const createReminderValidationSchema = Joi.object<ICreateReminder>({
  email: Joi.string().required().messages({
    "string.empty": "Email is empty",
    "string.email": "Email format is incorrect",
  }),
  message: Joi.string().required().messages({
    "string.empty": "Message is empty",
  }),
  reminder: Joi.date().required().messages({
    "date.base": "Reminder must be a valid date",
    "any.required": "Reminder date is required",
  }),
});
