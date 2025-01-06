import "reflect-metadata";
import { User } from "modules/Users/user.entity";
import AppDataSource from "database/data-source";
import { randomUUID } from "crypto";
import { hashPassword, verifyPassword} from "utils/PasswordUtil";
import { Inject, Service } from "typedi";
import { IUser } from "./user.interface";
import { randomNumber, randomSalt } from "utils/randomverifycode";
import { generateAccessToken, generateRefreshToken } from "modules/JWT/jwtUtil";
import { sendEmail } from "modules/nodemailer/nodemailer";
import { emailSending } from "modules/BullMQ/queue";

import { ApiError, AuthorizedError, NotFoundError } from "utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "modules/Auth/auth.services";
import { validateDate } from "utils/validatedoB";



@Service()
export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  // Tạo mới User
  async createUser(body: any): Promise<any> {
    const { email, password, name } = body;
    const existingUser = await this.userRepository.findOne({
      where: { email: email },
    });
    if (existingUser) {
      throw new AuthorizedError("Emails already exists");
    }
    const salt: string = randomUUID();
    const hashedPassword = await hashPassword(password);
    // // const newUser = new User({ ...body, salt: salt, password: hashedPassword });
    // const newUser = {"1"}
    // await this.userRepository.save(newUser);
    // return newUser;
  }
  // // Lấy tất cả User
  async getUsers() {
    const users = await this.userRepository.find();
    return users;
  }

  // Lấy User theo userId
  async getUserById(userId: number) {
    const user = await this.userRepository.findOneBy({ userId });
    if (user) {
      return user;
    }
    console.log("User not found!");
    return null;
  }

  // Cập nhật User
  async updateUser(userId: number, updatedData: Partial<User>) {
    let user = await this.userRepository.findOneBy({ userId });

    if (user) {
      user = { ...user, ...updatedData }; 
      await this.userRepository.save(user);
      console.log("User updated:", user);
      return user;
    } else {
      console.log("User not found!");
      return null;
    }
  }

  // Xóa User
  async deleteUser(userId: number) {
    const user = await this.userRepository.findOneBy({ userId });

    if (user) {
      await this.userRepository.remove(user);
      console.log("User deleted:", userId);
      return userId;
    } else {
      console.log("User not found!");
      return null;
    }
  }

  async findbyEmail(email: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      return existingUser;
    }
    throw new AuthorizedError("Email NOTTTT existt");
  }

  async GenerateNewSaltforRedis(email: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (!existingUser) {
      throw new AuthorizedError("Email NOTTTT exists");
    }
    const newSalt = randomSalt();
    const data = { ...existingUser, salt: newSalt };
    //save new salt
    await this.userRepository.save(data);
    return newSalt;
  }

  async RegisterUser(body: IUser) {
    const {
      email,
      password,
    } = body;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new AuthorizedError("Email already exists");
    }
    const hashedPassword = await hashPassword(password);
    //random code
    const verificationCode = randomNumber();
    const salt = randomSalt();


    // save user to database

    const newUser = await this.userRepository.save({ ...body, 
      password: hashedPassword, 
      verificationCode: verificationCode,
      salt: salt,
    });
    
    // sendmail:::: USER MESSING QUEUE -> bullmq

    //TODO: DISABLE TAM THOI DE TRANH SPAM
    emailSending({ toEmail: newUser.email, code: newUser.verificationCode });

    // response
    const {  email: userEmail, name } = newUser;

    return {  email: userEmail, name };
  }

  async verfiyToken(email: any, code: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (!existingUser) {
      throw new AuthorizedError("Email don't exists !! Please sign up");
    }
    if (existingUser.isVerified === true) {
      throw new AuthorizedError("Account verified !! Please use website");
    }
    // set field verify => true
    let { verificationCode } = existingUser;
    if (code === verificationCode) {
      // set user
      const data = { ...existingUser, isVerified: true };
      await this.userRepository.save(data);
      //
      return "Successfully verify account";
    }
    throw new AuthorizedError("Code not match !! Please try again");
  }

  async CheckUserExist(email:string,salt:string){
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (!existingUser) {
      throw new AuthorizedError("Email don't exists !! Please register");
    }
    const checkSalt = existingUser.salt
    if(salt !==checkSalt){
      throw new AuthorizedError("salt wrong!!! please log in new session")
    }
    return true
  }

  async UpdateInforUser(email:string,data: IUser) {
     const {
      dateOfBirth,
       Avatar,
       fullName,
       address,
       gender,
       phoneNumber,
    } 
    = data;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (!existingUser) {
      throw new NotFoundError("Email don't exist !! Please register");
    }
    let dateOfBirthValid: Date | undefined;
    if(dateOfBirth){
        dateOfBirthValid = validateDate(dateOfBirth);
    }
    const updateInfor = {
      ...existingUser,
      Avatar,
      dateOfBirth: dateOfBirthValid,
      fullName,
      address,
      gender,
      phoneNumber,
    };
    //save update
    await this.userRepository.save({ ...updateInfor });
    return { ...data };
  }

  async changePassword(email:string,oldpassword:string,newPassword:string){
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (!existingUser) {
      throw new AuthorizedError("Email don't exist !! Please register");
    }
    const verifyOldPassword = await verifyPassword(oldpassword,existingUser.password)
    if (!verifyOldPassword) {
      throw new AuthorizedError("Old password wrong");
    }
    const hashNewPassword = await hashPassword(newPassword)
    const updateUser = {...existingUser,password:hashNewPassword}
    // const updateUserPassword = new User({
    //   ...existingUser,
    //   password: hashNewPassword,
    // });
    const result = await this.userRepository.save({ ...updateUser });
    return result;
  }

  async GenerateNewSaltwithEmail(email:string){
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (!existingUser) {
      throw new AuthorizedError("Email don't exist !! Please register");
    }
    const newSalt = randomSalt()
    await this.userRepository.save({ ...existingUser, salt: newSalt });
    return newSalt

  }

  async ClearAllDatabase() {
    const users = await this.userRepository.find();
    await this.userRepository.remove(users);
    console.log("All users cleared from the database");
  }
}
