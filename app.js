import AppUserRouter from "./api/AppUserRouter.js";
import BidRouter from "./api/BidRouter.js";
import ProductRouter from "./api/ProductRouter.js";
import TransactionRouter from "./api/TransactionRouter.js";
import AdressRouter from "./api/AddressRouter.js";
import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import axios from "axios";
dotenv.config();

const PORT = 5000;
const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
    sameSite: "lax",
  })
);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/api", AppUserRouter);
app.use("/api/bids", BidRouter);
app.use("/api/products", ProductRouter);
app.use("/api/transactions", TransactionRouter);
app.use("/api/addresses", AdressRouter);

const checkProductStatus = async () => {
  axios
    .get("http://localhost:5000/api/products/status")
    .then((res) => {
      console.log("Product status monitoring started.");
    })
    .catch((err) => {
      console.log(err);
    });
};
setInterval(checkProductStatus, 5 * 1 * 1000);

// Define your routes and middleware here
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.listen(PORT || 5000, () => {
  console.log("JWT_SECRET :", process.env.JWT_SECRET);
  console.log(`Server is running on http://localhost:${PORT}`);
});
//
