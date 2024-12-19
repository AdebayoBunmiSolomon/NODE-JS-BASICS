import express from "express";
import {
  ILoginInterface,
  ILogOutInterface,
  IRegisterInterface,
} from "../interface/user.interface";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
  getUsers,
} from "../functions/user.functions";
import {
  errorResponse,
  generateOTP,
  generateSalt,
  passwordHash,
  SECRET,
  successResponse,
} from "../helper";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "../validators/user.validators";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createOtp } from "../functions/otp.functions";

export const logout: express.RequestHandler<{}, {}, ILogOutInterface> = async (
  req,
  res
) => {
  try {
    const { email } = req.body;
    const userExists = await getUserByEmail(email.toLowerCase());
    if (!userExists) {
      res.status(200).json(errorResponse("Invalid email address", null));
      return;
    }
    if (userExists) {
      userExists.sessionToken = "";
      await userExists.save(); // Save changes to the database
    }
    res
      .status(200)
      .json(successResponse("User successfully logged out", userExists));
  } catch (err: any) {
    res.status(400).json(errorResponse("Error processing request", null));
  }
};

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
    //generate OTP and save to db
    const otp = generateOTP();
    const createdOtp = await createOtp({
      email: email.toLowerCase(),
      otp: otp,
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

export const login: express.RequestHandler<{}, {}, ILoginInterface> = async (
  req,
  res
) => {
  try {
    const { error } = loginValidationSchema.validate(req.body);
    if (error) {
      res.status(400).json(errorResponse(`${error.message}`, null));
      return;
    }
    const { email, password } = req.body;
    const userExists = await getUserByEmail(email.toLowerCase()).select(
      "+password"
    );
    //validate and check if the user exists by email constraints.
    if (!userExists) {
      res.status(200).json(errorResponse("Invalid email address", null));
      return;
    }
    // Validate and compare password
    const isPasswordMatch = await bcrypt.compare(password, userExists.password);
    if (!isPasswordMatch) {
      res.status(400).json(errorResponse("Invalid login credentials", null));
      return;
    }
    // Generate JWT with a 1-hour expiry
    const token = jwt.sign(
      {
        id: userExists._id,
        email: userExists.email,
      },
      SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );
    //update sessionToken with generated JWT
    if (userExists) {
      userExists.sessionToken = token;
      await userExists.save(); // Save changes to the database
    }
    console.log("token is ", userExists?.sessionToken);
    res.status(200).json(successResponse("Login successful", userExists));
  } catch (err: any) {
    res
      .status(400)
      .json(errorResponse(`Error processing request, ${err}`, null));
  }
};

export const getAllUsers: express.RequestHandler<{}, {}, any> = async (
  req,
  res
) => {
  try {
    const users = await getUsers();
    if (users) {
      res
        .status(200)
        .json(successResponse("Users fetched successfully", users));
      return;
    }
  } catch (err: any) {
    res.status(400).json(errorResponse(`Error processing request, ${err}`));
  }
};
