import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { UsersController } from "./controller/user.controller";

export default () => {
  const router = Router();

  router.post("/user", UsersController.createUser);
  router.post("/login", UsersController.loginUser);

  router.get("/user", authMiddleware, UsersController.listUsers);
  router.get("/user/:cpf", UsersController.fetchUser);

  router.put("/user/:cpf", authMiddleware, UsersController.editUser);

  router.delete("/user/:cpf", authMiddleware, UsersController.deleteUser);

  return router;
};
