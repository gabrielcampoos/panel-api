import cors from "cors";
import express from "express";
import path from "path";

export function createServer() {
  const app = express();

  // Middleware para tratar JSON e URL-encoded
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Habilitar CORS para permitir acesso de diferentes origens
  app.use(cors());

  // Servir arquivos estáticos da pasta "F:/BrowserAutomationStudio/release"
  app.use(
    "/files", // URL onde os arquivos serão acessados
    express.static(path.join("F:/BrowserAutomationStudio/release")) // Caminho da pasta no servidor
  );

  // Roteamento para download de arquivos com base no ID
  app.get("/file/download/:id", (req, res) => {
    const fileId = req.params.id;
    const filePath = path.join("F:/BrowserAutomationStudio/release", fileId);

    // Verifica se o arquivo existe antes de tentar fazer o download
    res.download(filePath, (err) => {
      if (err) {
        console.error("Erro ao enviar o arquivo:", err);
        return res.status(500).send("Erro ao enviar o arquivo.");
      }
    });
  });

  return app;
}
