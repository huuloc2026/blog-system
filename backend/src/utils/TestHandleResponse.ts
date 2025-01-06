import { StatusCodes } from "http-status-codes";
import { Response } from "express";


const testNewResponseHandler = {
  // Phản hồi thành công
  success: (
    res: Response,
    statusCode: number = StatusCodes.ACCEPTED,
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
    statusCode: number = StatusCodes.FORBIDDEN,
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
export default testNewResponseHandler