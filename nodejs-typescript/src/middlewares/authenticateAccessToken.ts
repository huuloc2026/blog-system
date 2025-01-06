import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "modules/JWT/jwtUtil";
import AsyncHandler from "utils/AsyncHandler";
import { CustomJwtPayload } from "modules/JWT/interfaces/jwtpayload";
import { AuthorizedError, NotFoundError } from "utils/ApiError";
import { redisService } from "modules/Redis/redis.services";

export const authenticateAccessToken = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      throw new NotFoundError("Access token required");
    }
    try {
      const decoded = verifyAccessToken(token) as CustomJwtPayload;
      if (!decoded) throw new AuthorizedError("something authentication failed")
      const { userId, email, salt } = decoded
      const checkAccessCache = await redisService.CheckAccessMiddleware(salt)
      if (!checkAccessCache) throw new AuthorizedError("something authentication failed")
      req.userId = userId
      req.salt = salt;
      req.email = email
      next();
    } catch (error) {
      throw error
    }
  }
);
