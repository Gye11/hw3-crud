import dotenv from "dotenv/config";
import express from "express";
import contactsRouter from "./routers/contacts.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
import { initMongoConnection } from "./db/initMongoConnection.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use("/contacts", contactsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

await initMongoConnection();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
