import { getAllUsers, login, register } from "../controllers/user.controller";
import express from "express";
import { isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.get("/auth/getAllUsers", isAuthenticated, getAllUsers);
};
