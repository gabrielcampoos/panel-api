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

  // Função para fazer o upload
  public static async uploadFiles(req: Request, res: Response) {
    try {
      // Verifica se arquivos foram enviados
      if (!req.files || req.files.length === 0) {
        return res.status(400).send("Nenhum arquivo enviado.");
      }

      // Aqui, você pode fazer qualquer processamento que precisa com os arquivos, como salvar no banco de dados
      console.log("Arquivos carregados:", req.files);

      // Retornar uma resposta de sucesso
      return res.status(200).send("Arquivos carregados com sucesso.");
    } catch (error) {
      console.error("Erro ao fazer upload dos arquivos:", error);
      return res.status(500).send("Erro ao processar o upload.");
    }
  }

  // Função para verificar se o comando 7z está disponível
  private static async check7zCommand(): Promise<boolean> {
    return new Promise((resolve) => {
      exec("which 7z", (error, stdout) => {
        if (error || !stdout.trim()) {
          console.error("Comando 7z não encontrado:", error);
          resolve(false);
        } else {
          console.log("7z encontrado no caminho:", stdout.trim());
          resolve(true);
        }
      });
    });
  }

  // Função para criar o arquivo RAR
  private static async createRarArchive(
    folderPath: string,
    rarPath: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(
        "Executando comando 7z:",
        `7z a -r "${rarPath}" "${folderPath}"`
      );
      exec(`7z a -r "${rarPath}" "${folderPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error("Erro ao criar o arquivo 7z:", error);
          reject("Erro ao criar o arquivo.");
        } else {
          console.log("RAR criado com sucesso:", stdout);
          if (stderr) console.error("Erro no stderr:", stderr);
          resolve();
        }
      });
    });
  }

  // Função para excluir o arquivo temporário
  private static async deleteFileJon(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(`rm "${filePath}"`, (error) => {
        if (error) {
          console.error("Erro ao deletar o arquivo:", error);
          reject(error);
        } else {
          console.log("Arquivo temporário deletado com sucesso.");
          resolve();
        }
      });
    });
  }

  // Função principal de download
  static async downloadJonBet(req: Request, res: Response) {
    console.log("Requisição recebida para download de JonBet.");
    const folderPath = "/tmp/JonBet";
    const rarPath = path.join("/tmp", "JonBet.rar");

    try {
      // Verificar se o comando 7z está disponível
      const is7zAvailable = await this.check7zCommand();
      if (!is7zAvailable) {
        return res
          .status(500)
          .send("Comando 7z não está disponível no servidor.");
      }

      // Verificar se a pasta existe
      console.log("Verificando a existência da pasta:", folderPath);
      if (!fs.existsSync(folderPath)) {
        console.error("Pasta não encontrada no diretório /tmp");
        return res.status(404).send("Pasta não encontrada.");
      }

      // Criar o arquivo RAR
      await this.createRarArchive(folderPath, rarPath);

      // Iniciar o download do arquivo RAR
      console.log("Enviando arquivo RAR...");
      res.setHeader("Content-Type", "application/octet-stream");
      res.download(rarPath, "JonBet.rar", async (err) => {
        if (err) {
          console.error("Erro ao enviar o arquivo:", err);
          return res.status(500).send("Erro ao enviar o arquivo.");
        }

        // Excluir o arquivo RAR temporário após o download
        try {
          await this.deleteFileJon(rarPath);
        } catch (deleteError) {
          console.error(
            "Erro ao deletar o arquivo após o download:",
            deleteError
          );
        }
      });
    } catch (error) {
      console.error("Erro no backend:", error);
      res.status(500).send(error);
    }
  }
}
