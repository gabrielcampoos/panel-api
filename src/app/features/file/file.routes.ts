import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { FilesController } from "./controller/file.controller";
import multer from "multer";

const upload = multer({ dest: "/tmp/JonBet/" });

export default () => {
  const router = Router();

  router.post("/file", authMiddleware, FilesController.createFile);
  router.post(
    "/upload",
    authMiddleware,
    upload.array("files"),
    FilesController.uploadFiles
  );

  router.get("/file", authMiddleware, FilesController.listFiles);

  router.get(
    "/file/download-jonbet",
    authMiddleware,
    FilesController.downloadJonBet
  );

  router.put("/file/:id", authMiddleware, FilesController.editFile);
  router.delete("/file/:id", authMiddleware, FilesController.deleteFile);

  return router;
};
