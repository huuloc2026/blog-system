import { NextFunction, Request, RequestHandler, Response } from "express";


import { UserService } from "modules/Users/user.services";
import { Container, ContainerInstance, Inject, Service } from "typedi";
import responseHandler from "utils/ResponseHandler";
import { IUser } from "./user.interface";
import AsyncHandler from "utils/AsyncHandler";

import { StatusCodes } from "http-status-codes";
import { AuthorizedError, NotFoundError } from "utils/ApiError";
import { redisService } from "modules/Redis/redis.services";
import { generatePairKey } from "utils/GenerateKeyRedis";
import { generateAccessToken, generateRefreshToken, IpayloadJWT } from "modules/JWT/jwtUtil";
import { randomSalt } from "utils/randomverifycode";


// const userService = new UserService();

@Service()
class UserController {
  constructor(private userService: UserService) {
    this.userService = Container.get(UserService);
    201;
  }

  // Tạo mới người dùng
  createUser: RequestHandler = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { userName, fullName, password, uass, email, phoneNumber } = req.body;
      const newUser = await this.userService.createUser({ ...req.body });
      return responseHandler.success(
        res,
        StatusCodes.ACCEPTED,
        newUser,
        "User created successfully"
      );
    }
  );
  // Lấy tất cả người dùng
  getUsers: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { token } = req;
    console.log("accessToken::getUsers>>>>", token);
    try {
      const users = await this.userService.getUsers();
      responseHandler.success(res, 200, users, "Fetched all users");
    } catch (error) {
      responseHandler.error(res, 500, error, "Error fetching users");
      next(error);
    }
  };

  // Lấy người dùng theo ID
  getUserById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      responseHandler.error(res, 400, "Validation Error", "Invalid user ID");
      return;
    }

    try {
      const user = await this.userService.getUserById(userId);
      if (user) {
        responseHandler.success(res, 200, user, "User fetched successfully");
      } else {
        responseHandler.error(res, 404, "Not Found", "User not found");
      }
    } catch (error) {
      responseHandler.error(res, 500, error, "Error fetching user");
      next(error);
    }
  };

  // Cập nhật người dùng
  updateUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = parseInt(req.params.id);
    const updatedData = req.body;

    if (isNaN(userId)) {
      responseHandler.error(res, 400, "Validation Error", "Invalid user ID");
      return;
    }

    try {
      const updatedUser = await this.userService.updateUser(
        userId,
        updatedData
      );
      if (updatedUser) {
        responseHandler.success(
          res,
          200,
          updatedUser,
          "User updated successfully"
        );
      } else {
        responseHandler.error(res, 404, "Not Found", "User not found");
      }
    } catch (error) {
      responseHandler.error(res, 500, error, "Error updating user");
      next(error);
    }
  };

  // Xóa người dùng
  deleteUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      responseHandler.error(res, 400, "Validation Error", "Invalid user ID");
      return;
    }

    try {
      const deletedUserId = await this.userService.deleteUser(userId);
      if (deletedUserId) {
        responseHandler.success(
          res,
          200,
          { message: `User with ID ${deletedUserId} deleted` },
          "User deleted successfully"
        );
      } else {
        responseHandler.error(res, 404, "Not Found", "User not found");
      }
    } catch (error) {
      responseHandler.error(res, 500, error, "Error deleting user");
      next(error);
    }
  };

  // CLient

  RegisterUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const newUser = await this.userService.RegisterUser(req.body);
      responseHandler.success(res, 401, newUser, "Success register");
    } catch (error) {
      responseHandler.error(res, 500, error, "Error fetching users");
      next(error);
    }
  };

  UpdateInforUser: RequestHandler = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { userId, email, salt } = req;
      const data: IUser = req.body;
      if (!email) throw new NotFoundError("Invalid email");
      const updateUser = await this.userService.UpdateInforUser(email, data);
      return responseHandler.success(
        res,
        201,
        updateUser,
        "Successful update infor"
      );
    }
  );
  ChangePasswordUser: RequestHandler = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, salt } = req;
      if (!email || !salt) throw new NotFoundError("Email don't exist ")
      const check = await this.userService.CheckUserExist(email, salt)
      if (!check) throw new AuthorizedError("Wrongggg!!")
      const { oldPassword, newPassword, confirmPassword } = req.body;
      if (newPassword !== confirmPassword)
        throw new AuthorizedError("Confirm new password and confirm password not match");
      const UserwithNewPassword = await this.userService.changePassword(
        email,
        oldPassword,
        confirmPassword
      );

      //check Key Redis and Delete, Generate new accessToken,refresh Token
      //TODO: NOTES REFRACT THIS
      const checkKey = await redisService.CheckPairKeyExist(salt)
      if (!checkKey) throw new NotFoundError("Key not exist")
        // delete key redis
      await redisService.deletePairKeys(salt)
      // generate new key 
      const newKey = await this.userService.GenerateNewSaltwithEmail(email)
      const newPayload: IpayloadJWT = { 
        userId: UserwithNewPassword.userId, 
        email: UserwithNewPassword.email, 
        salt: newKey }
        // generate pair tokens
      const newAccessToken = generateAccessToken(newPayload);
      const newRefreshToken = generateRefreshToken(newPayload);
      // save to cache
      await redisService.saveTokensToRedis(newKey, newAccessToken, newRefreshToken);
      console.log("::::::New salt, access token, refresh token!!!");
      return responseHandler.success(res, StatusCodes.ACCEPTED, { newAccessToken ,newRefreshToken}, "Successful ! Changed Password !")
    }
  );
}
export default UserController;
