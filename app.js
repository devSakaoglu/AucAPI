// import mongoose from "mongoose";
import AppUserRouter from "./api/AppUserRouter.js"; // Import AppUserRouter
import BidRouter from "./api/BidRouteri.js"; // Import BidRouter
import ProductRouter from "./api/ProductRouter.js";
import { AppUser, Bid, Product } from "./Db.js";
import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use("/api", AppUserRouter); // Mount AppUserRouter
app.use("/api", BidRouter); // Mount BidRouter
app.use("/api", ProductRouter);

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

app.post("/signup", async (req, res) => {
  let check = await AppUser.findOne({ email: req.body.email });
  if (check) {
    return res
      .status(400)
      .json({ success: false, errors: "existing user found with same email" });
  }

  const user = new AppUser({
    name: req.body.name,
    surname: req.body.surname,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
  });
  await AppUser.save();

  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

app.post("/login/default", async (req, res) => {
  const user = await AppUser.find();
  const userID = user[0].id;
  console.log(userID);
  const token = jwt.sign({ userID, role: "AppUser" }, "secret key");
  const token_Data = jwt.verify(token, "secret key");
  res.json({
    token,
    token_Data,
  });
});

// export default app;
