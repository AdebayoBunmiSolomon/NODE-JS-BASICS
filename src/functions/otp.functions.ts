import { OtpModel } from "../model/otp.db";

export const getOtps = () => OtpModel.find();
export const getOtpsByEmail = (email: string) =>
  OtpModel.findOne({ email: email })
    .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
    .exec(); // Execute the query;
export const createOtp = (values: Record<string, any>) =>
  new OtpModel(values).save().then((otp) => otp.toObject());
