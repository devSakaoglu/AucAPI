import AppUserRouter from "./api/AppUserRouter.js";
import BidRouter from "./api/BidRouter.js";
import ProductRouter from "./api/ProductRouter.js";
import TransactionRouter from "./api/TransactionRouter.js";
import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import dotenv from "dotenv";
dotenv.config();

const PORT = 5000;
const app = express();
app.use(express.json());
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

// Define your routes and middleware here
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.listen(PORT || 5000, () => {
  console.log("JWT_SECRET :", process.env.JWT_SECRET);
  console.log(`Server is running on http://localhost:${PORT}`);
});
//
