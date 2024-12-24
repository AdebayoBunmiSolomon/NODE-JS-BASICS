import express from "express";
import { IChangePassword } from "../../interface/user.interface";
import {
  errorResponse,
  generateSalt,
  passwordHash,
  successResponse,
} from "../../helper";
import { changePasswordValidationSchema } from "../../validators/user.validators";
import {
  getUserByEmail,
  updateUserByEmail,
} from "../../functions/user.functions";
import bcrypt from "bcrypt";

export const changePassword: express.RequestHandler<
  {},
  {},
  IChangePassword
> = async (req, res) => {
  try {
    const { error } = changePasswordValidationSchema.validate(req.body);
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;
    if (error) {
      res.status(400).json(errorResponse(error?.message, null));
      return;
    }

    const isEmailValid = await getUserByEmail(email?.toLowerCase()).select(
      "+password"
    );
    if (!isEmailValid) {
      res.status(200).json(errorResponse("Invalid email address", null));
      return;
    }

    //validate and check that old password and password from DB is correct.
    const decodedOldPassword = await bcrypt.compare(
      oldPassword,
      isEmailValid?.password
    );
    if (!decodedOldPassword) {
      res.status(200).json(errorResponse("Old password is incorrect", null));
      return;
    }

    if (oldPassword === newPassword) {
      res
        .status(400)
        .json(
          errorResponse("Old password and new password are the same", null)
        );
      return;
    }

    if (confirmNewPassword !== newPassword) {
      res
        .status(400)
        .json(
          errorResponse(
            "confirm password and new password does not match",
            null
          )
        );
      return;
    }

    const salt = await generateSalt();
    const hashedNewPassword = await passwordHash(newPassword, salt);
    const updateUserWithNewPassword = await updateUserByEmail(
      email.toLowerCase(),
      {
        password: hashedNewPassword,
      }
    );
    res.status(200).json(
      successResponse("Password changed successfully", {
        username: updateUserWithNewPassword?.username,
        email: updateUserWithNewPassword?.email,
      })
    );
    return;
  } catch (err: any) {
    res
      .status(400)
      .json(errorResponse(`Error processing request ${err}`, null));
  }
};
