import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

import authRouter from "./routers/auth.js";
import contactsRouter from "./routers/contacts.js";

const app = express();

const swaggerDocument = JSON.parse(
  fs.readFileSync("./docs/swagger.json", "utf-8"),
);

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/auth", authRouter);
app.use("/contacts", contactsRouter);

export default app;
