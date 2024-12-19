import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  sessionToken: { type: String, default: "", select: false },
  activated: { type: Boolean, default: false, required: true },
});

export const UserModel = mongoose.model("User", userSchema);
