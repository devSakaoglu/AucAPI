import AppUserRouter from "./api/AppUserRouter.js";
import BidRouter from "./api/BidRouteri.js";
import ProductRouter from "./api/ProductRouter.js";
import express from "express";
import cors from "cors";
const PORT = 5000;
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/api", AppUserRouter, BidRouter, ProductRouter);
// Define your routes and middleware here
app.get("/", (req, res) => {
  const data = {
    message: "Hello World!",
  };
  res.json(data);
});

app.listen(PORT, () => {
  console.log("JWT_SECRET :", process.env.JWT_SECRET);
  console.log(`Server is running on http://localhost:${PORT}`);
});
//
