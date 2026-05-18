import jwt from "jsonwebtoken";
import { SessionCollection } from "../db/models/session.js";

export const createSession = async (userId) => {
  await SessionCollection.deleteOne({ userId });

  const accessToken = jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    },
  );

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);

  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  return SessionCollection.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
};
