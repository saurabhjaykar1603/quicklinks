import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json()); // middle express

const PORT = process.env.PORT || 8080; // port number initialized

const connDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_DB_URI);
  if (conn) {
    console.log(`MongoDB Connected`);
  }
};

app.listen(() => {
  console.log(`Server is listening on ${PORT}`);
  connDB();
});
