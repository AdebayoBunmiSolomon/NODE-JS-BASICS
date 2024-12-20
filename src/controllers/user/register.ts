import { IRegisterInterface } from "../../interface/user.interface";
import express from "express";
import { registerValidationSchema } from "../../validators/user.validators";
import {
  errorResponse,
  generateOTP,
  generateSalt,
  passwordHash,
  successResponse,
} from "../../helper";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from "../../functions/user.functions";
import { createOtp } from "../../functions/otp.functions";

export const register: express.RequestHandler<
  {},
  {},
  IRegisterInterface
> = async (req, res, next) => {
  try {
    // Validate the request body
    const { error } = registerValidationSchema.validate(req.body);
    if (error) {
      res.status(400).json(errorResponse(`${error?.message}`, null));
      return;
    }
    const { username, email, password } = req.body;
    //validate if email already exists
    const emailExists = await getUserByEmail(email.toLowerCase());
    if (emailExists) {
      res.status(200).json(errorResponse("Email already exists", null));
      return;
    }
    //validate if username already exists
    const usernameExists = await getUserByUsername(username.toLowerCase());
    if (usernameExists) {
      res.status(200).json(errorResponse("username already exists", null));
      return;
    }
    //hash password and save to DB
    const salt = await generateSalt();
    const hashedPassword = await passwordHash(password, salt);
    const createdUser = await createUser({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      activated: false,
    });
    //generate OTP, add 5mins expiry time, and save to db
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expire in 5 minutes

    // Convert expiresAt to system's local timezone
    const localExpiresAt = new Date(
      expiresAt.getTime() - expiresAt.getTimezoneOffset() * 60 * 1000
    );
    const expiresAtISO = localExpiresAt.toISOString(); // Store as ISO string for MongoDB

    const createdOtp = await createOtp({
      email: email.toLowerCase(),
      otp: otp,
      expiresAt: expiresAtISO,
    });

    // Attach OTP to the request object for the next middleware
    req.body.generatedOtp = createdOtp?.otp; // Add the generated OTP to the request body

    res.status(200).json(
      successResponse("User registered successfully", {
        username: createdUser?.username,
        email: createdUser?.email,
        sessionToken: createdUser?.sessionToken,
        otp: createdOtp?.otp,
        otpCreatedAt: createdOtp?.createdAt,
        otpExpiresAt: createdOtp?.expiresAt,
      })
    );
    return next();
  } catch (err: any) {
    res.status(400).json(errorResponse(`Error processing request, ${err}`));
  }
};
