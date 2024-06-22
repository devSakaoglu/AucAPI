import mongoose from "mongoose";

const bidScheme = new mongoose.Schema({
  appUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  bidPrice: {
    type: Number,
    required: true,
  },
  bidTime: {
    type: Date,
    default: Date.now,
  },
});

export default bidScheme;
