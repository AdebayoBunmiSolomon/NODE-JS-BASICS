import express from "express";
import { IForgotPassword } from "../../interface/user.interface";
import { errorResponse, generateOTP, successResponse } from "../../helper";
import { changeUserPasswordValidationSchema } from "../../validators/user.validators";
import { getUserByEmail } from "../../functions/user.functions";
import { createOtp } from "../../functions/otp.functions";

export const validateEmail: express.RequestHandler<
  {},
  {},
  IForgotPassword
> = async (req, res, next) => {
  try {
    const { error } = changeUserPasswordValidationSchema.validate(req.body);
    const { email } = req.body;
    if (error) {
      res.status(400).json(errorResponse(error?.message, null));
      return;
    }

    //validate and check if email is valid or it exists
    const emailExists = await getUserByEmail(email.toLowerCase()).select(
      "+email"
    );
    if (!emailExists) {
      res.status(200).json(errorResponse("Email does not exist", null));
      return;
    }
    //generate OTP, add 5mins expiry time, and save to db
    const otp = generateOTP();
    const createdOtp = await createOtp({
      email: email.toLowerCase(),
      otp: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    req.body.generatedOtp = createdOtp?.otp;
    res
      .status(200)
      .json(successResponse("OTP sent to email successfully", null));
    return next();
  } catch (err: any) {
    res.status(400).json(errorResponse("Error processing request", null));
  }
};
