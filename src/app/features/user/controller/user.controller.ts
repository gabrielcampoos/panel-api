import { Request, Response } from "express";
import { httpHelper } from "../../../shared/utils";
import { Result } from "../../../shared/utils/result.helper";
import { CreateUserDto } from "../dto";
import {
  CreateUserUsecase,
  DeleteUserUsecase,
  EditUserUsecase,
  FetchUserUsecase,
  ListAllUsersUsecase,
  LoginUserDto,
  LoginUserUsecase,
} from "../usecase";

export class UsersController {
  public static async createUser(req: Request, res: Response) {
    const user: CreateUserDto = req.body;

    try {
      const usecase = new CreateUserUsecase();
      const result = await usecase.execute(user);

      if (!result.success) return httpHelper.badRequestError(res, result);

      return httpHelper.success(res, result);
    } catch (error: any) {
      return httpHelper.badRequestError(
        res,
        Result.error(500, error.toString())
      );
    }
  }

  public static async loginUser(req: Request, res: Response) {
    const { cpf, password }: LoginUserDto = req.body;

    try {
      const usecase = new LoginUserUsecase();
      const result = await usecase.execute({ cpf, password });

      if (!result.success) return httpHelper.badRequestError(res, result);

      return httpHelper.success(res, result);
    } catch (error: any) {
      return httpHelper.badRequestError(
        res,
        Result.error(500, error.toString())
      );
    }
  }

  public static async listUsers(req: Request, res: Response) {
    try {
      const usecase = new ListAllUsersUsecase();
      const result = await usecase.execute();

      return httpHelper.success(res, result);
    } catch (error: any) {
      return httpHelper.badRequestError(
        res,
        Result.error(500, error.toString())
      );
    }
  }

  public static async editUser(req: Request, res: Response) {
    const { cpf } = req.params;
    const { name, password, role, active, accessExpiration } = req.body;

    try {
      const usecase = new EditUserUsecase();
      const result = await usecase.execute({
        cpf,
        newData: { name, password, role, active, accessExpiration },
      });

      if (!result.success) return httpHelper.badRequestError(res, result);

      return httpHelper.success(res, result);
    } catch (error: any) {
      return httpHelper.badRequestError(
        res,
        Result.error(500, error.toString())
      );
    }
  }

  public static async deleteUser(req: Request, res: Response) {
    const { cpf } = req.params;

    try {
      const usecase = new DeleteUserUsecase();
      const result = await usecase.execute(cpf);

      if (!result.success) return httpHelper.badRequestError(res, result);

      return httpHelper.success(res, result);
    } catch (error: any) {
      return httpHelper.badRequestError(
        res,
        Result.error(500, error.toString())
      );
    }
  }

  public static async fetchUser(req: Request, res: Response) {
    const { cpf } = req.params;

    try {
      const usecase = new FetchUserUsecase();
      const result = await usecase.execute(cpf);

      if (!result.success) return httpHelper.badRequestError(res, result);

      return httpHelper.success(res, result);
    } catch (error: any) {
      return httpHelper.badRequestError(
        res,
        Result.error(500, error.toString())
      );
    }
  }
}
