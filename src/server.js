import dotenv from "dotenv/config";
import app from "../app.js";
import { initMongoConnection } from "./db/initMongoConnection.js";

const PORT = Number(process.env.PORT) || 3000;

await initMongoConnection();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
