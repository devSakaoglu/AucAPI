import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken";
import db from "./Db.js";

const app = express();
app.use(express.json());
// Define your routes and middleware here
app.get("/", (req, res) => {
  const data = {
    message: "Hello World!",
  };
  res.json(data);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
