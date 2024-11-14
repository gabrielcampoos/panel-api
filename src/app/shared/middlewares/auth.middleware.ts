import { NextFunction, Request, Response } from "express";
import { httpHelper, jwt, Result } from "../utils";
import { Role } from "../../models";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return httpHelper.badRequestError(
      res,
      Result.error(401, "Token inválido.")
    );
  }

  try {
    const decodedUser = jwt.decoded(token) as {
      id: string;
      name: string;
      role: Role;
      active: boolean;
      accessExpiration: Date;
      manager: boolean;
    };

    req.user = {
      id: decodedUser.id,
      name: decodedUser.name,
      role: decodedUser.role as Role,
      active: decodedUser.active,
      accessExpiration: new Date(decodedUser.accessExpiration),
    };

    return next();
  } catch (error: any) {
    return httpHelper.badRequestError(res, Result.error(401, error.toString()));
  }
};
