import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { HttpError } from "../utils/httpError";

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      const errorMessage = error.details.map((err) => err.message).join(", ");
      throw new HttpError(400, `Validation error: ${errorMessage}`);
    }

    next();
  };
};
