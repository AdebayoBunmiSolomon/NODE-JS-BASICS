import crypto from "crypto";

const SECRET = "NODE-JS-BASICS";

export const random = () => {
  return crypto.randomBytes(128).toString("base64");
};

export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
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
