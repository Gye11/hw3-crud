import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
} from "../services/auth.js";

import { UserCollection } from "../db/models/user.js";
import { SessionCollection } from "../db/models/session.js";

import { sendMail } from "../utils/sendMail.js";

const setupSession = (res, session) => {
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
    sameSite: "none",
    secure: true,
  });
};

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: "Successfully registered a user!",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: "Successfully logged in an user!",
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshUsersSessionController = async (req, res) => {
  const session = await refreshUsersSession(req.cookies.refreshToken);

  setupSession(res, session);

  res.json({
    status: 200,
    message: "Successfully refreshed a session!",
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  await logoutUser(req.cookies.refreshToken);

  res.clearCookie("refreshToken");

  res.status(204).send();
};

export const sendResetEmailController = async (req, res) => {
  const email = req.body.email.trim().toLowerCase();

  const user = await UserCollection.findOne({
    email,
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const resetToken = jwt.sign(
    {
      email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "5m",
    },
  );

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;

  try {
    await sendMail({
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Password reset</h2>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });
  } catch (error) {
    throw createHttpError(
      500,
      "Failed to send the email, please try again later.",
    );
  }

  res.json({
    status: 200,
    message: "Reset password email has been successfully sent.",
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw createHttpError(401, "Token is expired or invalid.");
  }

  const user = await UserCollection.findOne({
    email: decodedToken.email,
  });

  if (!user) {
    throw createHttpError(404, "User not found.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await UserCollection.findByIdAndUpdate(user._id, {
    password: hashedPassword,
  });

  await SessionCollection.deleteMany({
    userId: user._id,
  });

  res.json({
    status: 200,
    message: "Password has been successfully reset.",
    data: {},
  });
};
