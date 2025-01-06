import { Exclude, Expose } from "class-transformer";
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from "class-validator";


export class RegisterNewUser {
  @Expose()
  @IsEmail()
  @IsNotEmpty({ message: "Email is required" })
  email!: string; // Non-null assertion

  @Expose()
  @MinLength(6, { message: "Password min len" })
  @IsNotEmpty({ message: "Password is required" })
  password!: string;

  @Expose()
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @Expose()
  fullName?: string;
  @Expose()
  dateOfBirth?: Date;
  @Expose()
  gender?: "Male" | "Female" | "Other";
  @Expose()
  phoneNumber?: string;
  @Expose()
  address?: string;
}
