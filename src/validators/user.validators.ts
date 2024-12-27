import Joi from "joi";
import {
  IActivateAccount,
  IChangePassword,
  IForgotPassword,
  ILoginInterface,
  IRegisterInterface,
  IResendOTP,
  IUpdateAccount,
} from "../interface/user.interface";

export const registerValidationSchema = Joi.object<IRegisterInterface>({
  username: Joi.string().max(30).required().messages({
    "string.max": "Username must not exceed 30 characters",
    "string.empty": "Username is empty",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email format is incorrect",
    "string.empty": "Email is empty",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is empty",
  }),
  picture: Joi.any()
    .custom((value, helpers) => {
      const file = helpers.state.ancestors[0].file; // Access the file in req.file

      if (!file) {
        return helpers.error("any.required", { label: "Picture" });
      }

      // Check file type
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return helpers.error("string.mime", { mimeType: file.mimetype });
      }

      // Check file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return helpers.error("file.maxSize", { size: file.size });
      }

      return value; // Valid file
    })
    .messages({
      "any.required": "Picture is required",
      "string.mime":
        "Invalid picture format. Only JPEG, PNG, or GIF are allowed",
      "file.maxSize": "Picture size exceeds the 5MB limit",
    }),
});

export const loginValidationSchema = Joi.object<ILoginInterface>({
  email: Joi.string().email().required().messages({
    "string.empty": "email is empty",
    "string.email": "Email format is incorrect",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is empty",
  }),
});

export const activateAcctValidationSchema = Joi.object<IActivateAccount>({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is empty",
    "string.email": "Email format is incorrect",
  }),
  otp: Joi.string().required().messages({
    "string.empty": "OTP is empty",
  }),
});

export const resendOTPValidationSchema = Joi.object<IResendOTP>({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is empty",
    "string.email": "Email format is incorrect",
  }),
});

export const updateAcctValidationSchema = Joi.object<IUpdateAccount>({
  username: Joi.string().max(30).required().messages({
    "string.max": "Username must not exceed 30 characters",
    "string.empty": "Username is empty",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email format is incorrect",
    "string.empty": "Email is empty",
  }),
});

export const forgotPasswordValidationSchema = Joi.object<IForgotPassword>({
  email: Joi.string().required().messages({
    "string.empty": "Email is empty",
    "string.email": "Email format is incorrect",
  }),
});

export const changePasswordValidationSchema = Joi.object<IChangePassword>({
  email: Joi.string().required().messages({
    "string.empty": "Email is empty",
    "string.email": "Email format is incorrect",
  }),
  oldPassword: Joi.string().required().messages({
    "string.empty": "Old Password is empty",
  }),
  newPassword: Joi.string().required().messages({
    "string.empty": "new password is empty",
  }),
  confirmNewPassword: Joi.string().required().messages({
    "string.empty": "Confirm new password is empty",
  }),
});
