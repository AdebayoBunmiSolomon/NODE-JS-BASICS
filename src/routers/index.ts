import express from "express";
import user from "./user";
import reminder from "./reminder";

const router = express.Router();

export default (): express.Router => {
  user(router);
  reminder(router);
  return router;
};
