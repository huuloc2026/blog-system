// src/modules/Redis/redis.service.ts

import { redisClient } from "modules/Redis/redis.init";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { ConflictError, NotFoundError } from "utils/ApiError";
import { generatePairKey } from "utils/GenerateKeyRedis";
import { generateKeyPost } from "utils/GenerateKeyPost";

// Interface định nghĩa cấu trúc dữ liệu
export interface RedisKeyStatus {
  key: string;
  exists: boolean;
  value?: string | null;
  expirationStatus?: string;
}

export interface TokenPayload {
  accessToken: string;
  refreshToken: string;
}

// Redis Service Module
export const redisService = {
  // Kiểm tra key tồn tại
  async checkKey(key: string): Promise<boolean> {
    try {
      const existsKey = await redisClient.exists(key);
      if (!existsKey){
        return false
      }
      return true;
    } catch (err) {
      console.error(`Error checking key: ${key} in Redis:`, err);
      throw err;
    }
  },

  async CheckPairKeyExist(key: string): Promise<boolean> {
    const { accessKey,refreshKey} = generatePairKey(key)
    const checkKeyAccess = await redisService.checkKey(accessKey) 
    const checkRefreshToken = await redisService.checkKey(refreshKey) 
    if (!checkKeyAccess || !checkRefreshToken){
      return false
    }
    return true
  },

  async deletePairKeys(key: string): Promise<boolean> {
    const { accessKey, refreshKey } = generatePairKey(key)
    const checkKeyAccess = await redisService.deleteKeys(accessKey)
    const checkRefreshToken = await redisService.deleteKeys(refreshKey) 
    if (!checkKeyAccess || !checkRefreshToken) throw new ConflictError("Conflict del key")
    return true
  },

  // Xóa key khỏi Redis
  async deleteKeys(key: string): Promise<boolean> {
    try {
      await redisClient.del(key);
      console.log(`::REDIS-CLIENT:: Keys for ${key} have been deleted.`);
      return true
    } catch (error) {
      console.error(`Error deleting key: ${key} in Redis:`, error);
      throw error;
    }
  },

  // Lưu token vào Redis
  async saveTokensToRedis(
    key: string,
    accessToken: string,
    refreshToken: string
  ): Promise<any> {
    try {
      const timeAccess = parseInt(
        process.env.ACCESS_TOKEN_EXPIRE_TIME_REDIS || "30"
      );
      const timeRefresh = parseInt(
        process.env.REFRESH_TOKEN_EXPIRE_TIME_REDIS || "300"
      );

      const {accessKey,refreshKey} = generatePairKey(key)

      await redisClient.setEx(accessKey, timeAccess, accessToken);
      await redisClient.setEx(refreshKey, timeRefresh, refreshToken);
      console.log(`::REDIS-CLIENT:: Tokens for userId:${key} saved to Redis.`);
    } catch (error) {
      console.error("Error saving tokens to Redis:", error);
      throw error;
    }
  },

  async checkKeyPostInRedis(key: string){
    try {
      const timeAccess = parseInt(
        process.env.ACCESS_TOKEN_EXPIRE_TIME_REDIS || "30"
      );
      const NewJsonKey = await redisClient.json.get(key, {
        path: "$",
      });
      return NewJsonKey
    } catch (error) {
      console.error(error);
      throw error
    }
  },

  async getValuefromKeyPost(key:string){

  },

  async saveJsonPostToRedis(key:string,data:any):Promise<any>{
    try {
      const timeAccess = parseInt(
        process.env.ACCESS_TOKEN_EXPIRE_TIME_REDIS || "30"
      );
      // const rs = await redisClient.setEx(key, timeAccess, JSON.stringify(data));
      const NewJsonKey = await redisClient.json.set(key,"$",data)
      console.log("saved post to redis");
      return NewJsonKey
    } catch (error) {
      console.error(error);
      throw error
    }
  },

  // Lấy access token từ Redis
  async getAccessToken(userId: string): Promise<string | null> {
    try {
      const accessToken = await redisClient.get(`accessToken:${userId}`);
      return accessToken;
    } catch (err) {
      console.error("Error getting access token:", err);
      return null;
    }
  },

  // Kiểm tra refresh token tồn tại
  async checkRefreshToken(salt: string): Promise<boolean> {
    try {
      const refreshToken = await redisClient.get(`refreshToken:${salt}`);
      return !!refreshToken;
    } catch (err) {
      console.error("Error checking refresh token:", err);
      return false;
    }
  },

  // Kiểm tra giá trị Redis
  async getKeyStatus(key: string): Promise<any>{
    try {
      const accessToken = await redisClient.get(key);
      return accessToken;
    } catch (err) {
      console.error("Error checking Redis values:", err);
      throw err;
    }
  },




  // Kiểm tra thời gian hết hạn của key
  async getKeyExpiration(key: string): Promise<string> {
    try {
      const ttl = await redisClient.ttl(key);
      if (ttl === -1) {
        return `Key: ${key} does not have an expiration time.`;
      } else if (ttl === -2) {
        return `Key: ${key} does not exist.`;
      } else {
        return `Key: ${key} will expire in ${ttl} seconds.`;
      }
    } catch (err) {
      console.error("Error checking key expiration in Redis:", err);
      throw err;
    }
  },
  async CheckAccessMiddleware(key:string):Promise<boolean>{
    const accessKey = `accessToken:${key}`
    const result = await redisClient.get(accessKey)
    if(!result) throw new NotFoundError("Not found key") 
    return true
  }
};