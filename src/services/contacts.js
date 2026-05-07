import Contact from "../db/models/contacts.js";

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = "_id",
  sortOrder = "asc",
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find(filter);

  const contactsCount = await Contact.countDocuments(filter);

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });

  const totalPages = Math.ceil(contactsCount / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems: contactsCount,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const createContact = async (payload) => {
  return await Contact.create(payload);
};

export const updateContact = async (contactId, payload) => {
  return await Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
};

export const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};
