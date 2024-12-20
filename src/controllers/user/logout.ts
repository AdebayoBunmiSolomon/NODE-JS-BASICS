import express from "express";
import { ILogOutInterface } from "../../interface/user.interface";
import { getUserByEmail } from "../../functions/user.functions";
import { errorResponse, successResponse } from "../../helper";

export const logout: express.RequestHandler<{}, {}, ILogOutInterface> = async (
  req,
  res
) => {
  try {
    const { email } = req.body;
    const userExists: any = await getUserByEmail(email.toLowerCase());
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
