import express, { NextFunction } from "express";
import { errorResponse } from "../helper";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "ptechnologiez@gmail.com",
    pass: "fxdm tucl nfsm pebl",
  },
});

export const sendOTPToEmail = async (
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  try {
    const { email, generatedOtp } = req.body;
    const emailOptions = {
      from: "NODE JS BASICS",
      to: email,
      subject: "One Time Password",
      text: `Your OTP is ${generatedOtp}`,
    };
    await transporter.sendMail(emailOptions);
    console.log(`OTP sent successfully to ${email}`);
    return next();
  } catch (err: any) {
    res.status(400).json(errorResponse(`Error sending otp to email ${err}`));
  }
};
