import { Request, Response } from "express";
import { appEnvs } from "../../app/envs";
import { createServer } from "../config/express.config";
import { makeRoutes } from "./app.routes";

export function runServer() {
  const app = createServer();

  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      ok: true,
      message: "API Bombando",
    });
  });

  makeRoutes(app);

  app.listen(appEnvs.porta, () =>
    console.log("API esta rodando na porta " + appEnvs.porta)
  );
}
