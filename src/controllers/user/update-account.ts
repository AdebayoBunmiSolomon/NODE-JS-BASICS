import express from "express";
import { IUpdateAccount } from "../../interface/user.interface";
import { errorResponse, successResponse } from "../../helper";
import { updateAcctValidationSchema } from "../../validators/user.validators";
import { getUserByEmail, updateUserById } from "../../functions/user.functions";

export const updateAccount: express.RequestHandler<
  {},
  {},
  IUpdateAccount
> = async (req, res) => {
  try {
    const { error } = updateAcctValidationSchema.validate(req.body);
    const { id, email, username } = req.body;
    if (error) {
      res.status(400).json(errorResponse(error?.message, null));
      return;
    }

    //validate and check if email exist.
    const isEmailExist = await getUserByEmail(email.toLowerCase());
    if (!isEmailExist) {
      res.status(200).json(errorResponse("Email is invalid", null));
      return;
    }

    //update user account
    const updateUser = await updateUserById(id, {
      username: username,
      email: email.toLowerCase(),
      password: isEmailExist?.password,
      sessionToken: isEmailExist?.sessionToken,
      activated: isEmailExist?.activated,
    });
    res
      .status(200)
      .json(successResponse("User profile updated successfully", updateUser));
  } catch (err: any) {
    res.status(400).json(errorResponse("Error processing request", err));
  }
};
