import express from "express";
import { ILoginInterface } from "../../interface/user.interface";
import { loginValidationSchema } from "../../validators/user.validators";
import { errorResponse, SECRET, successResponse } from "../../helper";
import { getUserByEmail } from "../../functions/user.functions";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    //validate if user has been activated or not
    if (!userExists?.activated) {
      res
        .status(200)
        .json(
          errorResponse(
            "This account is not yet activated. Please go and activate account",
            null
          )
        );
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
