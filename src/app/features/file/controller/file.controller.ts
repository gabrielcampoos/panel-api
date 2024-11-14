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

  // Função principal de download
  static async downloadJonBet(req: Request, res: Response) {
    console.log("Requisição recebida para download de JonBet.");
    try {
      const folderPath = "/tmp/JonBet"; // Caminho da pasta a ser compactada
      const zipPath = path.join("/tmp", "JonBet.zip"); // Caminho onde o arquivo .zip será salvo

      console.log("Verificando a existência da pasta:", folderPath);
      if (!fs.existsSync(folderPath)) {
        console.error("Pasta não encontrada no diretório /tmp");
        return res.status(404).send("Pasta não encontrada.");
      }

      // Criando o arquivo .zip usando o Archiver
      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", {
        zlib: { level: 9 }, // Alta compressão
      });

      output.on("close", () => {
        console.log("Arquivo ZIP criado com sucesso!");
      });

      archive.on("error", (err) => {
        console.error("Erro ao criar o arquivo ZIP:", err);
        return res.status(500).send("Erro ao criar o arquivo.");
      });

      archive.pipe(output);
      archive.directory(folderPath, false); // Adiciona o conteúdo da pasta sem o nome da pasta
      await archive.finalize(); // Finaliza a criação do arquivo

      // Enviar o arquivo .zip para o cliente
      res.setHeader("Content-Type", "application/zip");
      res.download(zipPath, "JonBet.zip", (err) => {
        if (err) {
          console.error("Erro ao enviar o arquivo:", err);
          return res.status(500).send("Erro ao enviar o arquivo.");
        }
        console.log("Arquivo enviado com sucesso.");

        // Deletar o arquivo temporário após o download
        fs.unlink(zipPath, (delError) => {
          if (delError) {
            console.error("Erro ao deletar o arquivo:", delError);
          }
        });
      });
    } catch (err) {
      console.error("Erro no backend:", err);
      return res.status(500).send("Erro ao processar o download.");
    }
  }
}
