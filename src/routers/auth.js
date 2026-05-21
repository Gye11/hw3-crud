import { Router } from "express";

import {
  loginUserController,
  logoutUserController,
  refreshUsersSessionController,
  registerUserController,
  sendResetEmailController,
  resetPasswordController,
} from "../controllers/auth.js";

import validateBody from "../middlewares/validateBody.js";

import { registerUserSchema, loginUserSchema } from "../validation/auth.js";

const router = Router();

router.post(
  "/register",
  validateBody(registerUserSchema),
  registerUserController,
);

router.post("/login", validateBody(loginUserSchema), loginUserController);

router.post("/refresh", refreshUsersSessionController);

router.post("/logout", logoutUserController);

router.post("/send-reset-email", sendResetEmailController);

router.post("/reset-pwd", resetPasswordController);

export default router;
