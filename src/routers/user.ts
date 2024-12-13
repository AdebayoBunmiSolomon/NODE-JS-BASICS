import {
  getAllUsers,
  login,
  logout,
  register,
} from "../controllers/user.controller";
import express from "express";
import { isAuthenticated, sendOTPToEmail } from "../middlewares";

export default (router: express.Router) => {
  router.post("/auth/register", register, sendOTPToEmail);
  router.post("/auth/login", login);
  router.get("/auth/getAllUsers", isAuthenticated, getAllUsers);
  router.post("/auth/logout", logout);
};
