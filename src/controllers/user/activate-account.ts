import express from "express";
import { IActivateAccount } from "../../interface/user.interface";
import { activateAcctValidationSchema } from "../../validators/user.validators";
import { errorResponse, successResponse } from "../../helper";
import { getUserByEmail } from "../../functions/user.functions";
import {
  getOtp,
  getRecentOtpsByEmailAndOtp,
} from "../../functions/otp.functions";

export const activateAccount: express.RequestHandler<
  {},
  {},
  IActivateAccount
> = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const { error } = activateAcctValidationSchema.validate(req.body);
    if (error) {
      res.status(400).json(errorResponse(error?.message, null));
      return;
    }

    //validate and check if any user exists with provided mail address
    const userExists = await getUserByEmail(email.toLowerCase());
    if (!userExists) {
      res
        .status(200)
        .json(errorResponse(`Email does not exist or is invalid`, null));
      return;
    }

    //validate and check if OTP entered exists in DB
    const otpExists = await getOtp(otp);
    if (!otpExists) {
      res.status(200).json(errorResponse(`OTP ${otp} does not exists`, null));
      return;
    }

    const otpExistsWithEmail = await getRecentOtpsByEmailAndOtp(email, otp);
    if (!otpExistsWithEmail) {
      res
        .status(200)
        .json(
          errorResponse(
            `OTP:${otp} and email:${email.toLowerCase()} does not associates`,
            null
          )
        );
      return;
    }

    // Convert expiresAt (which is a string) to a Date object
    const currentDateUTC = new Date();
    if (currentDateUTC > otpExists.expiresAt) {
      console.log("Current date is:", currentDateUTC);
      console.log("OTP Expiry date is:", otpExists?.expiresAt);
      res.status(200).json(errorResponse("OTP is already expired", null));
      return;
    }

    if (userExists) {
      userExists.activated = true;
      await userExists.save();
    }
    res.status(200).json(successResponse("User activated successfully"));
  } catch (err: any) {
    res.status(400).json(errorResponse(`Error processing request`, err));
  }
};
