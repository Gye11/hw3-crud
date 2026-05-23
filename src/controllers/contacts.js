import createHttpError from "http-errors";

import cloudinary from "../utils/cloudinary.js";

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../services/contacts.js";

export const getContactsController = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy,
    sortOrder,
    type,
    isFavourite,
  } = req.query;

  const userId = req.user._id;

  const filter = {};

  if (type) {
    filter.contactType = type;
  }

  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === "true";
  }

  const contacts = await getAllContacts({
    page: Number(page),
    perPage: Number(perPage),
    sortBy,
    sortOrder,
    filter,
    userId,
  });

  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: "Successfully found contact!",
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const userId = req.user._id;

  let photo;

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);

    photo = result.secure_url;
  }

  const newContact = await createContact({
    ...req.body,
    userId,
    photo,
  });

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;

  const userId = req.user._id;

  let photo;

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);

    photo = result.secure_url;
  }

  const updatedContact = await updateContact(
    contactId,
    {
      ...req.body,
      ...(photo && { photo }),
    },
    userId,
  );

  if (!updatedContact) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  const userId = req.user._id;

  const deletedContact = await deleteContact(contactId, userId);

  if (!deletedContact) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(204).send();
};
