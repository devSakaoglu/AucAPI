import mongoose from "mongoose";
import { AppUser } from "./Db.js";

const ProductScheme = mongoose.Schema({
  appUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    required: true,
  },
  bids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Bid",
    required: true,
  },
  name: {
    type: String, //string check
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startPrice: {
    type: Number, //number check
    required: true,
  },

  tags: {
    type: [String], //string check
    required: false,
  },
  category: {
    type: [String], //enum or string check
    required: true,
  },
  quantity: {
    // add details about the quantity
    type: Number,
    required: false,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  modifiedTime: {
    type: Date,
    default: Date.now,
  },
});

const   Product = mongoose.model("Product", ProductScheme);

export default Product;
// module.exports = Product;