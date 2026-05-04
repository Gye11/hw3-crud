import mongoose from "mongoose";

export const initMongoConnection = async () => {
  const user = process.env.MONGODB_USER;
  const password = process.env.MONGODB_PASSWORD;
  const url = process.env.MONGODB_URL;
  const db = process.env.MONGODB_DB;

  const mongoUrl = `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`;

  await mongoose.connect(mongoUrl);

  console.log("Mongo connection successfully established!");
};
