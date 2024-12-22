export interface IRegisterInterface {
  username: string;
  email: string;
  password: string;
  generatedOtp: string;
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
  id: string;
  username: string;
  email: string;
}
