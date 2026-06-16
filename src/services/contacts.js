import Contact from "../db/models/contacts.js";

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = "_id",
  sortOrder = "asc",
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find({
    ...filter,
    userId,
  });

  const contactsCount = await Contact.countDocuments({
    ...filter,
    userId,
  });

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

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({
    _id: contactId,
    userId,
  });
};

export const createContact = async (payload) => {
  return await Contact.create(payload);
};

export const updateContact = async (contactId, payload, userId) => {
  return await Contact.findOneAndUpdate(
    {
      _id: contactId,
      userId,
    },
    payload,
    {
      new: true,
    },
  );
};

export const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });
};
