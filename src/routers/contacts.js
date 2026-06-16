import { Router } from "express";

import ctrlWrapper from "../utils/ctrlWrapper.js";

import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from "../controllers/contacts.js";

import validateBody from "../middlewares/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";

import { upload } from "../middlewares/upload.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../db/models/contacts.js";

const router = Router();

router.use(authenticate);

router.get("/", ctrlWrapper(getContactsController));

router.get("/:contactId", isValidId, ctrlWrapper(getContactByIdController));

router.post(
  "/",
  upload.single("photo"),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  "/:contactId",
  upload.single("photo"),
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));

export default router;
