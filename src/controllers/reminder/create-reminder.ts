import express from "express";
import { ICreateReminder } from "../../interface/reminder.interface";
import { errorResponse, successResponse } from "../../helper";
import { createReminderValidationSchema } from "../../validators/reminder.validators";
import { createAReminder } from "../../functions/reminder.functions";

export const createReminder: express.RequestHandler<
  {},
  {},
  ICreateReminder
> = async (req, res) => {
  try {
    const { error } = createReminderValidationSchema.validate(req.body);
    const { email, message, reminder } = req.body;
    if (error) {
      res.status(400).json(errorResponse(error?.message, null));
      return;
    }

    // Subtract 1 hour from the reminder date
    const adjustedReminder = new Date(reminder);
    adjustedReminder.setHours(adjustedReminder.getHours() - 1);

    const createdReminder = await createAReminder({
      email: email.toLowerCase(),
      message: message,
      reminder: adjustedReminder,
    });

    res
      .status(200)
      .json(successResponse("Reminder created successfully", createdReminder));
  } catch (err: any) {
    res
      .status(400)
      .json(errorResponse(`Error processing request ${err}`, null));
  }
};
