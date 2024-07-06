import mongoose from "mongoose";
import AppUserSchema from "./Schemas/AppUser.schema.js";
import BidSchema from "./Schemas/Bid.schema.js";
import { ProductSchema } from "./Schemas/Product.schema.js";
import AddressSchema from "./Schemas/Address.schema.js";
import { TransactionSchema } from "./Schemas/Transaction.schema.js";
import dotenv from "dotenv";
dotenv.config();
// MongoDB connection URL
const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/auction";

// Connect to MongoDB
mongoose
  .connect(mongoURL, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Models intergration
const AppUser = mongoose.model("AppUser", AppUserSchema);
const Bid = mongoose.model("Bid", BidSchema);
const Product = mongoose.model("Product", ProductSchema);
const Address = mongoose.model("Address", AddressSchema);
const Transaction = mongoose.model("Transaction", TransactionSchema);

export { AppUser, Bid, Product, Address, Transaction };
