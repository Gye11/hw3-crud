import { Router } from "express";

import ctrlWrapper from "../utils/ctrlWrapper.js";

import {
  loginUserController,
  logoutUserController,
  refreshUsersSessionController,
  registerUserController,
  sendResetEmailController,
  resetPasswordController,
} from "../controllers/auth.js";

import validateBody from "../middlewares/validateBody.js";

import {
  registerUserSchema,
  loginUserSchema,
  sendResetEmailSchema,
  resetPwdSchema,
} from "../validation/auth.js";

const router = Router();

router.post(
  "/register",
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  "/login",
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post("/refresh", ctrlWrapper(refreshUsersSessionController));

router.post("/logout", ctrlWrapper(logoutUserController));

router.post(
  "/send-reset-email",
  validateBody(sendResetEmailSchema),
  ctrlWrapper(sendResetEmailController),
);

router.post(
  "/reset-pwd",
  validateBody(resetPwdSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
