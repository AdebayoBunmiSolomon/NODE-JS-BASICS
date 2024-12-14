import express, { NextFunction } from "express";
import { errorResponse } from "../helper";
import { getUserBySessionToken } from "../functions/user.functions";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(401).json(errorResponse("Access denied. No token provided"));
      return;
    }
    const token = authHeader.split(" ")[1]; // Extract the token
    const existingUser = await getUserBySessionToken(token);
    if (!existingUser) {
      res
        .status(200)
        .json(errorResponse("User is not authenticated. Please login first"));
      return;
    }
    return next();
  } catch (err) {
    res.status(400).json(errorResponse(`Error processing request ${err}`));
  }
};
