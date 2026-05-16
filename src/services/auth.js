import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

import UserCollection from "../db/models/User.js";
import SessionCollection from "../db/models/Session.js";
import { createSession } from "../utils/createSession.js";

export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({
    email: payload.email,
  });

  if (user) {
    throw createHttpError(409, "Email in use");
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({
    email: payload.email,
  });

  if (!user) {
    throw createHttpError(401, "Unauthorized");
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, "Unauthorized");
  }

  const session = await createSession(user._id);

  return session;
};

export const refreshUsersSession = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, "Refresh token missing");
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (error) {
    throw createHttpError(401, "Refresh token expired");
  }

  const currentSession = await SessionCollection.findOne({
    refreshToken,
  });

  if (!currentSession) {
    throw createHttpError(401, "Session not found");
  }

  await SessionCollection.deleteOne({
    _id: currentSession._id,
  });

  return createSession(currentSession.userId);
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return;

  await SessionCollection.deleteOne({
    refreshToken,
  });
};
