export interface IUser {
  email: string;
  password: string;
  name: string;
  fullName?: string;
  dateOfBirth?: Date | string;
  gender?: "Male" | "Female" | "Other";
  phoneNumber?: string;
  verificationCode?:string;
  salt?:string
  address?: string;
  Avatar?: string;
}
