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

const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cardData: { type: Object },
  date: { type: Date, default: Date.now },
});

app.post("/signup", async (req, res) => {
  const model = await Users.findOne({ email: req.body.email });
  if (model) {
    return res.status(400).json({
      data: model,
      success: false,
      errors: "existing user found with same email",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cardData: cart,
  });
  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

export default app;
