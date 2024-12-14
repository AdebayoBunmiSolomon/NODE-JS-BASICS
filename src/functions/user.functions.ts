import { UserModel } from "../model/users.db";

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) =>
  UserModel.findOne({ email: email });
export const getUserByUsername = (username: string) =>
  UserModel.findOne({ username: username });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findOneAndUpdate({ id, values });
