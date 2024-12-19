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
