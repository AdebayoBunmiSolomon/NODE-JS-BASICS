import { register } from "../controllers/user.controller";
import express from "express";

export default (router: express.Router) => {
  router.post("/auth/register", register);
};
