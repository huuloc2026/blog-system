import {Container, Service} from "typedi";

import { redisService } from "modules/Redis/redis.services";
import { verifyPassword } from "utils/PasswordUtil";
import { generateAccessToken, generateRefreshToken, IpayloadJWT } from "modules/JWT/jwtUtil";


import { UserService } from "modules/Users/user.services";
import { ApiError, AuthorizedError, ConflictError, NotFoundError } from "utils/ApiError";

export interface Keyredis {
  key:string
}

// const userService = new UserService();
@Service()
export class AuthService {
  constructor(
    private userService: UserService

  ) {
    this.userService = Container.get(UserService)
  }
  async loginUser(data: any): Promise<any> {
    const { email, password } = data;
    const existingUser = await this.userService.findbyEmail(email);
    if (!existingUser) {
      throw new NotFoundError( "Email does not exist.");
    }
    const isPasswordMatch = await verifyPassword(
      password,
      existingUser.password
    );
    if (!isPasswordMatch) {
      throw new AuthorizedError( "Invalid password");
    }
    const payload: IpayloadJWT = {
      userId: existingUser.userId,
      email: existingUser.email,
      salt: existingUser.salt,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const responsedata = {
      userId: existingUser.userId,
      email: existingUser.email,
      name: existingUser.name,
      accessToken,
      refreshToken,
    };

    const keyRedis = `${existingUser.salt}`;

    await redisService.saveTokensToRedis(keyRedis, accessToken, refreshToken);
    return responsedata;
  }

  async LogoutUser(key: string): Promise<any> {
    //check key exist in redis
    
    const checkKey = await redisService.CheckPairKeyExist(key)
    if (!checkKey) {
        throw new NotFoundError("Key not exist")
      }
    // delete access, refresh token from redis
    const delKey = await redisService.deletePairKeys(key)
    if (!delKey ) {
      throw new ConflictError("Key not exist")
    }
    return true
  }
  async Register(data: any) {
    return await this.userService.RegisterUser(data);
  }

  async VerifyAccount(email:string,code: string) {
    return await this.userService.verfiyToken(email, code);
  }
}
