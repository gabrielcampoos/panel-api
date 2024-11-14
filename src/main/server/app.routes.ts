import { Express } from "express";
import userRoutes from "../../app/features/user/user.routes";
import fileRoutes from "../../app/features/file/file.routes";

export const makeRoutes = (app: Express) => {
  app.use(userRoutes(), fileRoutes());
};
