import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CustomJwtPayload } from 'modules/JWT/interfaces/jwtpayload';

dotenv.config();

export interface IpayloadJWT {
  userId: number;
  email: string;
  salt: string;
}


const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_EXPIRE_TIME } = process.env;

export const generateAccessToken = (payload: IpayloadJWT) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET as string, {
    expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
  });
};

export const generateRefreshToken = (payload: IpayloadJWT) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET as string, {
    expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
  });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET as string);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET as string);
};
