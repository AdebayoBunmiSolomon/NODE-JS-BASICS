import express from "express";
import { IUpdateAccount } from "../../interface/user.interface";
import { errorResponse, successResponse } from "../../helper";
import { updateAcctValidationSchema } from "../../validators/user.validators";
import { getUserById, updateUserById } from "../../functions/user.functions";

export const updateAccount: express.RequestHandler<
  { userId: string },
  {},
  IUpdateAccount
> = async (req, res) => {
  try {
    const { error } = updateAcctValidationSchema.validate(req.body);
    const { email, username } = req.body;
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json(errorResponse("User ID not supplied", null));
      return;
    }

    if (error) {
      res.status(400).json(errorResponse(error?.message, null));
      return;
    }

    //validate and check if email exist.
    const isUserExist = await getUserById(userId);
    if (!isUserExist) {
      res.status(200).json(errorResponse("User does not exist", null));
      return;
    }

    // Check if picture was uploaded
    const file = req.file; // Multer attaches the uploaded file to req.file
    let pictureUrl: string | undefined;

    if (file) {
      pictureUrl = `${req.protocol}://${req.get("host")}/uploads/images/${
        file.filename
      }`;
    } else {
      pictureUrl = isUserExist?.picture;
    }

    //update user account
    const updateUser = await updateUserById(userId, {
      username: username,
      email: email.toLowerCase(),
      picture: pictureUrl,
    });
    res
      .status(200)
      .json(successResponse("User profile updated successfully", updateUser));
  } catch (err: any) {
    res.status(400).json(errorResponse("Error processing request", err));
  }
};
