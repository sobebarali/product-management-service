import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError";

export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  next(err);
};

export const errorResponder = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {  
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong",
  });
};
