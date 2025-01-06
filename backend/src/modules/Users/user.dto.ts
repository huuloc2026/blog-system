import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsDateString, IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length, Matches, MinLength } from 'class-validator';
import { Unique } from 'typeorm';

export class CreateUserDTO {
  @Expose()
  @IsString()
  @IsNotEmpty({ message: "userName is required" })
  userName!: string;

  @Expose()
  @IsString()
  @IsNotEmpty({ message: "password is required" })
  password!: string;

  @Expose()
  @IsString()
  @IsNotEmpty({ message: "fullName is required" })
  fullName!: string;

  @Expose()
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "email is required" })
  email!: string;

  @IsString()
  @IsOptional()
  @Length(10, 15, {
    message: "phoneNumber must be between 10 and 15 characters",
  })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: "phoneNumber must be a valid phone number",
  })
  phoneNumber?: string;
}

export class GetUserbyIdDTO {
    @IsInt()
    @IsNotEmpty()
    id!: number;
}
export class DeleteUserDTO {
  @IsInt()
  @IsNotEmpty()
  id!: number;
}

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  userName?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEmail({}, { message: "Invalid email format" })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @Length(10, 15, {
    message: "phoneNumber must be between 10 and 15 characters",
  })
  phoneNumber?: string;
}

export class RegisterNewUserDTO {
  @Expose()
  @IsEmail()
  @IsNotEmpty({ message: "Email is required" })
  email!: string; // Non-null assertion

  @Expose()
  @MinLength(6, { message: "Password min length 6 char" })
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

export class UpdateInforUserDTO {
  @Expose()
  @IsOptional()
  name!: string;

  @Expose()
  @IsOptional()
  Avatar?: string;

  @Expose()
  @IsOptional()
  fullName?: string;

  @Expose()
  @IsOptional()
  @IsDateString({strict:true},{message:"Please valid in YYYY-MM-DD"})
  dateOfBirth?: Date;

  @Expose()
  @IsOptional()
  @IsIn(["Male", "Female", "Other"], {
    message:
      "Please choose one of the following options: Male, Female, or Other",
  })
  gender?: "Male" | "Female" | "Other";

  @Expose()
  @IsOptional()
  @IsPhoneNumber("VN", {
    message: "Please input valid in VN Numberphone - 10 number",
  })
  phoneNumber?: string;

  @Expose()
  @IsOptional()
  address?: string;
}


export class ChangePasswordDTO {
  @Expose()
  oldPassword: string;
  @Expose()
  newPassword: string;
  @Expose()
  confirmPassword: string;
}

