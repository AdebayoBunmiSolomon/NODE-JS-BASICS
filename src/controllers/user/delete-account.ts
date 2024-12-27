import express from "express";
import { errorResponse, successResponse } from "../../helper";
import { deleteUserById, getUserById } from "../../functions/user.functions";

export const deleteAccount: express.RequestHandler<
  { userId: string },
  {},
  any
> = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.send(400).json(errorResponse("User ID not supplied", null));
      return;
    }

    const userExist = await getUserById(userId);
    if (!userExist) {
      res.status(200).json(errorResponse("User does not exists", null));
      return;
    }

    const deletedUser = await deleteUserById(userId);
    res
      .status(200)
      .json(
        successResponse(
          `User "${deletedUser?.username}", deleted successfully`,
          null
        )
      );
    return;
  } catch (err: any) {
    res.send(400).json(errorResponse(`Error processing request ${err}`, null));
  }
};
