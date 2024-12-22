import express from "express";
import { IResendOTP } from "../../interface/user.interface";
import { errorResponse, generateOTP, successResponse } from "../../helper";
import { resendOTPValidationSchema } from "../../validators/user.validators";
import { createOtp } from "../../functions/otp.functions";
import { getUserByEmail } from "../../functions/user.functions";

export const resendOTP: express.RequestHandler<{}, {}, IResendOTP> = async (
  req,
  res,
  next
) => {
  try {
    const { error } = resendOTPValidationSchema.validate(req.body);
    const { email } = req.body;
    if (error) {
      res.status(400).json(errorResponse(error?.message, null));
      return;
    }

    const emailExists = await getUserByEmail(email.toLowerCase());
    if (!emailExists) {
      res.status(200).json(errorResponse("Email does not exists", null));
      return;
    }

    //generate OTP, add 5mins expiry time, and save to db
    const otp = generateOTP();

    const createdOtp = await createOtp({
      email: email.toLowerCase(),
      otp: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 mins expiry time,
    });

    // Attach OTP to the request object for the next middleware
    req.body.generatedOtp = createdOtp?.otp; // Add the generated OTP to the request body
    res.status(200).json(successResponse("OTP generated successfully", null));
    return next();
  } catch (err: any) {
    res.status(400).json(errorResponse("Error processing request", err));
  }
};
