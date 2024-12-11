import express from "express";
import { IUserInterface } from "../interface/user.interface";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from "../functions/user.functions";
import {
  authentication,
  random,
  errorResponse,
  successResponse,
} from "../helper";

export const register: express.RequestHandler<{}, {}, IUserInterface> = async (
  req,
  res
) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !username || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const emailExists = await getUserByEmail(email.toLowerCase());
    if (emailExists) {
      res.status(200).json(errorResponse("Email already exists"));
      return;
    }
    const usernameExists = await getUserByUsername(username.toLowerCase());
    if (usernameExists) {
      res.status(200).json(errorResponse("username already exists"));
      return;
    }
    const salt = random();
    const createdUser = await createUser({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      authentication: {
        salt: salt,
        password: authentication(salt, password),
      },
    });
    res
      .status(200)
      .json(successResponse("User registered successfully", createdUser));
    return;
  } catch (err: any) {
    res.status(400).json(errorResponse(`Error processing request, ${err}`));
  }
};
