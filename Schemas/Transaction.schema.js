import mongoose from "mongoose";
import validator from "validator";
const TransactionStatus = Object.freeze({
  default: "default",
  Pending: "Pending",
  Completed: "Completed",
  Cancelled: "Cancelled",
});

const TransactionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    enum: TransactionStatus,
    type: String,
    required: true,
    default: TransactionStatus.default,
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

TransactionSchema.method(
  "changeStatus",
  async function (status = TransactionStatus.default) {
    try {
      this.status = status;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
);
//
TransactionSchema.pre("save", async function (next) {
  this.modifiedDate = Date.now();
  next();
});

export { TransactionSchema, TransactionStatus };
