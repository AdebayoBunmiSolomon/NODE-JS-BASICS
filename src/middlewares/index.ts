import express, { NextFunction } from "express";
import { errorResponse, SECRET } from "../helper";
import { getUserBySessionToken } from "../functions/user.functions";
import jwt, { JwtPayload } from "jsonwebtoken";

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
    // Step 1: Verify the token's validity and expiration
    let decodedToken: JwtPayload | string;
    try {
      decodedToken = jwt.verify(token, SECRET); // Verify token
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        res
          .status(400)
          .json(errorResponse("Token has expired. Please login again.", null));
        return;
      }
      res
        .status(400)
        .json(errorResponse("Invalid token. Access denied.", null));
      return;
    }
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
