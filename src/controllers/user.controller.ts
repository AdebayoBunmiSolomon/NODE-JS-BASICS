import express from "express";
import {
  ILoginInterface,
  IRegisterInterface,
} from "../interface/user.interface";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
  getUsers,
} from "../functions/user.functions";
import {
  authentication,
  random,
  errorResponse,
  successResponse,
} from "../helper";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "../validators/user.validators";

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
    const userExists = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!userExists) {
      res.status(200).json(errorResponse("Invalid email address"));
      return;
    }

    const expectedHash = authentication(
      String(userExists?.authentication?.salt),
      password
    );
    if (String(userExists?.authentication?.password) !== expectedHash) {
      res.status(200).json(errorResponse("Invalid login credentials", null));
      return;
    }
    // Generate a new session token and update it in the database
    const salt = random();
    if (userExists.authentication) {
      userExists.authentication.sessionToken = authentication(
        salt,
        userExists._id.toString()
      );
      await userExists.save(); // Save changes to the database
    }
    console.log("token is ", userExists?.authentication?.sessionToken);
    res.cookie("NODE-JS-BASICS", userExists?.authentication?.sessionToken, {
      domain: "localhost",
      path: "/",
    });
    res.status(200).json(successResponse("Login successful", userExists));
  } catch (err: any) {
    res
      .status(400)
      .json(errorResponse(`Error processing request, ${err}`, null));
  }
};

export const register: express.RequestHandler<
  {},
  {},
  IRegisterInterface
> = async (req, res) => {
  try {
    // Validate the request body
    const { error } = registerValidationSchema.validate(req.body);
    if (error) {
      res.status(400).json(errorResponse(`${error?.message}`, null));
      return;
    }
    const { username, email, password } = req.body;
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
        sessionToken: "",
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
