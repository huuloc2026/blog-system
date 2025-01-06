import { Request, Response, NextFunction } from "express";
import responseHandler from "utils/ResponseHandler";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error";

  if (res.headersSent) {
    return next(err);
  }
  const errorResponse = {
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };
  responseHandler.error(res, statusCode, errorResponse);
};

export default errorHandler;
