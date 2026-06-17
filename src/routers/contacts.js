import { Router } from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from "../controllers/contacts.js";

const router = Router();

router.get("/", ctrlWrapper(getContactsController));
router.get("/:contactId", ctrlWrapper(getContactByIdController));
router.post("/", ctrlWrapper(createContactController));
router.patch("/:contactId", ctrlWrapper(updateContactController));
router.delete("/:contactId", ctrlWrapper(deleteContactController));

export default router;
