export interface IRegisterInterface {
  username: string;
  email: string;
  password: string;
  generatedOtp: string;
  picture?: Express.Multer.File;
}

export interface ILoginInterface {
  email: string;
  password: string;
}

export interface ILogOutInterface {
  email: string;
}

export interface IActivateAccount {
  email: string;
  otp: string;
}

export interface IResendOTP {
  email: string;
  generatedOtp: string;
}

export interface IUpdateAccount {
  username: string;
  email: string;
  picture?: Express.Multer.File;
}

export interface IForgotPassword {
  email: string;
  generatedOtp: string;
}

export interface IChangePassword {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
