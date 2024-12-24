import {
  activateAccount,
  changePassword,
  getAllUsers,
  login,
  logout,
  register,
  resendOTP,
  updateAccount,
  validateEmail,
} from "../controllers/user.controller";
import express from "express";
import { isAuthenticated, sendOTPToEmail } from "../middlewares";

export default (router: express.Router) => {
  router.post("/auth/register", register, sendOTPToEmail);
  router.post("/auth/login", login);
  router.get("/auth/getAllUsers", isAuthenticated, getAllUsers);
  router.post("/auth/logout", logout);
  router.post("/auth/activate-account", activateAccount);
  router.post("/auth/resend-otp", resendOTP, sendOTPToEmail);
  router.put("/auth/update-account/:userId", updateAccount);
  router.post("/auth/forgot-password", validateEmail, sendOTPToEmail);
  router.post("/auth/change-password", changePassword);
};
