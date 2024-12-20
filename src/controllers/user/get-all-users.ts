import express from "express";
import { getUsers } from "../../functions/user.functions";
import { errorResponse, successResponse } from "../../helper";

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
