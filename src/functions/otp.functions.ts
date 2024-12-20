import { OtpModel } from "../model/otp.db";

export const getOtps = () => OtpModel.find(); // get all otps
export const getRecentOtpsByEmailAndOtp = (email: string, otp: string) =>
  OtpModel.findOne({ email: email, otp: otp })
    .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
    .exec(); // Execute the query;
export const createOtp = (values: Record<string, any>) =>
  new OtpModel(values).save().then((otp) => otp.toObject()); // create an otp generated

export const getOtp = (otp: string) => OtpModel.findOne({ otp: otp }); // get single otp
