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
import { FileRepository } from "../repository/file.repository";
import { exec } from "child_process";

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

  static async downloadJonBet(req: Request, res: Response) {
    // Caminhos para a pasta e arquivo RAR no diretório temporário do Render
    const folderPath = "/tmp/JonBet"; // Use o diretório temporário
    const rarPath = path.join("/tmp", "JonBet.rar");

    // Certifique-se de que a pasta existe no diretório /tmp
    if (!fs.existsSync(folderPath)) {
      console.error("Pasta não encontrada no diretório /tmp");
      return res.status(404).send("Pasta não encontrada.");
    }

    // Cria o arquivo RAR no diretório /tmp
    exec(`rar a -r "${rarPath}" "${folderPath}"`, (error) => {
      if (error) {
        console.error("Erro ao criar o arquivo RAR:", error);
        return res.status(500).send("Erro ao criar o arquivo RAR.");
      }

      // Após criar o arquivo RAR, faça o download
      res.download(rarPath, "JonBet.rar", (err) => {
        if (err) {
          console.error("Erro ao enviar o arquivo:", err);
          return res.status(500).send("Erro ao enviar o arquivo.");
        }

        // Deletar o arquivo temporário após o download
        exec(`rm "${rarPath}"`, (delError) => {
          if (delError) {
            console.error("Erro ao deletar o arquivo:", delError);
          }
        });
      });
    });
  }
}
