import cors from "cors";
import express from "express";
import path from "path";
import fs from "fs";

export function createServer() {
  const app = express();

  const corsOptions = {
    origin: "*", // Permite todas as origens
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
    methods: ["GET", "POST", "PUT", "DELETE"],
  };

  // Middleware para tratar JSON e URL-encoded
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Habilitar CORS para permitir acesso de diferentes origens
  app.use(cors(corsOptions));

  // Configurar a pasta estática
  app.use(
    "/files",
    express.static(path.join("F:/BrowserAutomationStudio/release"))
  );

  // Rota para download de arquivos pelo ID
  app.get("/file/download/:id", (req, res) => {
    const fileId = req.params.id;
    const filePath = path.join("F:/BrowserAutomationStudio/release", fileId);

    // Verifica se o arquivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("Arquivo não encontrado:", filePath);
        return res.status(404).send("Arquivo não encontrado.");
      }

      // Se o arquivo existe, inicia o download
      res.download(filePath, (downloadErr) => {
        if (downloadErr) {
          console.error("Erro ao enviar o arquivo:", downloadErr);
          return res.status(500).send("Erro ao enviar o arquivo.");
        }
        console.log("Download concluído com sucesso para o arquivo:", fileId);
      });
    });
  });

  return app;
}
