import { Request, Response } from "express";
import archiver from "archiver";
import fs from "fs";
import path from "path";
import { httpHelper } from "../../../shared/utils";
import { Result } from "../../../shared/utils/result.helper";
import { CreateFileDto } from "../dto";
import {
  CreateFileUsecase,
  DeleteFileUsecase,
  ListFilesUsecase,
  UpdateFileUsecase,
} from "../usecase";

export class FilesController {
  public static async createFile(req: Request, res: Response) {
    const file: CreateFileDto = req.body;

    try {
      const usecase = new CreateFileUsecase();
      const result = await usecase.execute(file);

      if (!result.success) return httpHelper.badRequestError(res, result);

      return httpHelper.success(res, result);
    } catch (error: any) {
      return httpHelper.badRequestError(
        res,
        Result.error(500, error.toString())
      );
    }
  }

  public static async listFiles(req: Request, res: Response) {
    try {
      const usecase = new ListFilesUsecase();
      const result = await usecase.execute();

      return httpHelper.success(res, result);
    } catch (error: any) {
      return httpHelper.badRequestError(
        res,
        Result.error(500, error.toString())
      );
    }
  }

  public static async editFile(req: Request, res: Response) {
    const { id } = req.params;
    const { filename, filepath, size, available } = req.body;

    try {
      const usecase = new UpdateFileUsecase();
      const result = await usecase.execute(id, {
        filename,
        filepath,
        size,
        available,
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

  public static async deleteFile(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const usecase = new DeleteFileUsecase();
      const result = await usecase.execute(id);

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
