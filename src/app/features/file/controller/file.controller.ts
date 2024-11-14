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
    const folderPath = "F:/BrowserAutomationStudio/release/JonBet";
    const zipPath = path.join(
      "F:/BrowserAutomationStudio/release",
      "JonBet.zip"
    );

    // Criação do arquivo ZIP
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Definir a compressão máxima
    });

    // Configura o pipeline para o arquivo de saída
    archive.pipe(output);

    // Adiciona a pasta ao arquivo ZIP
    archive.directory(folderPath, false);

    // Finaliza a criação do arquivo ZIP
    archive.finalize();

    // Quando o arquivo ZIP estiver pronto, envia para o cliente
    output.on("close", () => {
      res.download(zipPath, "JonBet.zip", (err) => {
        if (err) {
          console.error("Erro ao enviar o arquivo:", err);
          return res.status(500).send("Erro ao enviar o arquivo.");
        }

        // Deleta o arquivo após o envio
        fs.unlinkSync(zipPath);
      });
    });

    // Erros durante a criação do arquivo ZIP
    archive.on("error", (err) => {
      console.error("Erro ao criar o arquivo ZIP:", err);
      return res.status(500).send("Erro ao criar o arquivo ZIP.");
    });
  }
}
