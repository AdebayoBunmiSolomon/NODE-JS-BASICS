import crypto from "crypto";
import bcrypt from "bcrypt";

export const SECRET = "NODE-JS-BASICS";

export const random = () => {
  return crypto.randomBytes(128).toString("base64");
};

export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};

export const generateSalt = async () => {
  return await bcrypt.genSalt(10);
};

export const passwordHash = async (password: any, salt: any) => {
  return await bcrypt.hash(password, salt);
};

export const successResponse = (message: string, data: any = null) => {
  return {
    success: true,
    message,
    data,
  };
};

export const errorResponse = (message: string, data: any = null) => {
  return {
    success: false,
    message,
    data,
  };
};

export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000); //Generates a 6-digit OTP
  return otp.toString();
};
