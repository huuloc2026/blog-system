import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export interface IResponseData {
    message?: string;
    data?: any;
    error?: string;
}

const responseHandler = {
  // Phản hồi thành công
  success: (
    res: Response,
    statusCode: StatusCodes = StatusCodes.CREATED,
    data: any,
    message: string = "Request successful"
  ) => {
    return res.status(statusCode).json({
      message,
      data,
      error: null,
    });
  },

  // Phản hồi lỗi
  error: (
    res: Response,
    statusCode: number,
    error: unknown,
    message: string = "An error occurred"
  ) => {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      errorMessage = (error as any).message;
    }

    return res.status(statusCode).json({
      message: errorMessage,
      data: null,
      error: process.env.NODE_ENV === "development" ? message : null,
    });
  },
};

export default responseHandler;
