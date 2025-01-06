import { NextFunction, Request, RequestHandler, Response } from "express";
import { AuthService } from "modules/Auth/auth.services";
import { UserService } from "modules/Users/user.services";
import {
  generateAccessToken,
  generateRefreshToken,
  IpayloadJWT,
  verifyAccessToken,
  verifyRefreshToken,
} from "modules/JWT/jwtUtil";
import responseHandler from "utils/ResponseHandler";
import AsyncHandler from "utils/AsyncHandler";
import { ApiError, AuthorizedError, NotFoundError } from "utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { Container, Inject } from "typedi";
import { Service } from "typedi";
import { CustomJwtPayload } from "modules/JWT/interfaces/jwtpayload";
import { redisService } from "modules/Redis/redis.services";
// const userService = new UserServices

@Service()
class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.authService = Container.get(AuthService);
    this.userService = Container.get(UserService);
  }

  Register: RequestHandler = AsyncHandler(
    async (req: Request, res: Response,next: NextFunction): Promise<any> => {
      const data = req.body;
      const result = await this.authService.Register(data);
      return responseHandler.success(
        res,
        StatusCodes.CREATED,
        result,
        "Register new account successfully"
      );
    }
  );

  Login: RequestHandler = AsyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const userInfo = await this.authService.loginUser(data);
    return responseHandler.success(
      res,
      StatusCodes.CREATED,
      userInfo,
      "Login successfully"
    );
  });

  Verify: RequestHandler = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      //const {email,code} = req.body
      const { email, salt } = req;
      const { code } = req.body;
      if (!email || !salt) throw new NotFoundError("Something not found");
      const checkExist = await this.userService.CheckUserExist(email, salt);
      if (!checkExist) {
        throw new AuthorizedError("failllll verify");
      }
      const userInfo = await this.authService.VerifyAccount(email, code);
      responseHandler.success(
        res,
        StatusCodes.ACCEPTED,
        userInfo,
        "Verify Account successfully"
      );
    }
  );

  refreshAccessToken: RequestHandler = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return responseHandler.error(
          res,
          StatusCodes.UNAUTHORIZED,
          "Refresh token not found! Please log in",
          "refreshAccessToken:::Refresh token not found"
        );
      }

      const decoded = verifyRefreshToken(refreshToken);

      if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
        return responseHandler.error(
          res,
          StatusCodes.UNAUTHORIZED,
          "Invalid refresh token! Please log in",
          "refreshAccessToken:::Invalid refresh token"
        );
      }
      const { email, salt } = decoded as CustomJwtPayload;
      const checkEmail = await this.userService.findbyEmail(email);
      if (salt !== checkEmail.salt) {
        throw new AuthorizedError("Refresh Token invalid");
      }

      const keyExists = await redisService.checkRefreshToken(checkEmail.salt);
      if (!keyExists) {
        return responseHandler.error(
          res,
          StatusCodes.UNAUTHORIZED,
          "Refresh token expired or invalid! Please log in",
          "refreshAccessToken:::Refresh token not found in Redis"
        );
      }

      await redisService.deleteKeys(salt);

      const newKey = await this.userService.GenerateNewSaltforRedis(email);

      const newPayload: IpayloadJWT = {
        userId: checkEmail.userId,
        email: checkEmail.email,
        salt: newKey,
      };

      const newAccessToken = generateAccessToken(newPayload);
      const newRefreshToken = generateRefreshToken(newPayload);

      await redisService.saveTokensToRedis(newKey, newAccessToken, newRefreshToken);

      return responseHandler.success(
        res,
        StatusCodes.CREATED,
        { accessToken: newAccessToken, refreshToken: newRefreshToken },
        "Access token refreshed successfully"
      );
    }
  );

  Logout: RequestHandler = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { userId, email, salt } = req;
      //check input from middleware
      if (!userId || !salt || !email)
        throw new NotFoundError("Not found ! try again");
      // log out
      const LogOutUser = await this.authService.LogoutUser(salt);
      //generate new salt for account
      // await this.userService.GenerateNewSaltforRedis(email);
      return responseHandler.success(
        res,
        StatusCodes.ACCEPTED,
        LogOutUser,
        "Log out successfully and cleared all token"
      );
    }
  );

  TestHandleAsync: RequestHandler = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const test = false;
      if (!test) {
        throw new ApiError("Password error");
      }

      return responseHandler.success(
        res,
        200,
        { test },
        "Test executed successfully"
      );
    }
  );
}

export default AuthController;
