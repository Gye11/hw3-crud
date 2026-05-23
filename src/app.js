import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routers/auth.js";
import contactsRouter from "./routers/contacts.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/contacts", contactsRouter);

export default app;
