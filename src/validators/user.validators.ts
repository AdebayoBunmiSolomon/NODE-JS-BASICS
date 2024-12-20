import Joi from "joi";
import {
  IActivateAccount,
  ILoginInterface,
  IRegisterInterface,
  IResendOTP,
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
