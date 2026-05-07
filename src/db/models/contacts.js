import mongoose from "mongoose";
import Joi from "joi";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },

    phoneNumber: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },

    email: {
      type: String,
      minlength: 3,
      maxlength: 20,
    },

    isFavourite: {
      type: Boolean,
      default: false,
    },

    contactType: {
      type: String,
      enum: ["work", "home", "personal"],
      default: "personal",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal"),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal"),
});

const Contact = mongoose.model("contact", contactSchema);

export default Contact;
