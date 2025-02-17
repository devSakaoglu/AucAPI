import mongoose from "mongoose";
const status = Object.freeze({
  pending: "Pending",
  accepted: "Payment Waiting",
  rejected: "Rejected",
});

const BidScheme = new mongoose.Schema({
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
  sellerUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    required: true,
  },
  status: {
    enum: status,
    type: String,
    required: true,
    default: "Pending",
  },

  bidPrice: {
    type: Number,
    required: true,
  },

  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  modifiedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export default BidScheme;
