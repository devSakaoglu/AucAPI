import AppUserRouter from "./api/AppUserRouter.js";
import BidRouter from "./api/BidRouteri.js";
import ProductRouter from "./api/ProductRouter.js";
import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
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
app.use(cors());
app.use("/api", AppUserRouter);
app.use("/api/bids", BidRouter);
app.use("/api", ProductRouter);

// Define your routes and middleware here
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.listen(PORT, () => {
  console.log("JWT_SECRET :", process.env.JWT_SECRET);
  console.log(`Server is running on http://localhost:${PORT}`);
});
//
