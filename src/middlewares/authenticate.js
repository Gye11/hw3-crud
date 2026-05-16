import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

import SessionCollection from "../db/models/session.js";
import UserCollection from "../db/models/user.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return next(createHttpError(401, "Authorization header missing"));
  }

  const [bearer, token] = authHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    return next(createHttpError(401, "Invalid auth header"));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(createHttpError(401, "Access token expired"));
  }

  const session = await SessionCollection.findOne({
    accessToken: token,
  });

  if (!session) {
    return next(createHttpError(401, "Session not found"));
  }

  const user = await UserCollection.findById(session.userId);

  if (!user) {
    return next(createHttpError(401, "User not found"));
  }

  req.user = user;

  next();
};
