import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  constructor( message:string, isOperational = true, stack = "") {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export class AuthorizedError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  constructor(
    message: string = ReasonPhrases.UNAUTHORIZED,
    isOperational = true,
    stack = ""
  ) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export class NotFoundError extends ApiError {
  public readonly statusCode: number;
  constructor(message: string = "Resource Not Found") {
    super(message, true);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export class ConflictError extends ApiError {
  public readonly statusCode: number;
  constructor(message: string = ReasonPhrases.CONFLICT) {
    super(message, true);
    this.statusCode = StatusCodes.CONFLICT;
  }
}
