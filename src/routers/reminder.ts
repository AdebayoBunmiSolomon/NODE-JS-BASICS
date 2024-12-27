import express from "express";
import { createReminder } from "../controllers/reminder.controller";

export default (router: express.Router) => {
  router.post("/reminder/create-reminder", createReminder);
};
