import mongoose from "mongoose";
import validator from "validator";
const TransactionStatus = {
  default: "default",
  Pending: "Pending",
  Completed: "Completed",
  Cancelled: "Cancelled",
};
Object.freeze(TransactionStatus);

const TransactionStatuses = Object.values(TransactionStatus);
const TransactionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    required: false,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  modifiedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    enum: TransactionStatuses,
    type: String,
    required: true,
    default: TransactionStatus.default,
  },
});

//method defination

TransactionSchema.method("pendingTransaction", async function () {
  try {
    this.status = TransactionStatus.Pending;
    console.log("Transaction is pending");
    return true;
  } catch (error) {
    console.log(error);
    return error;
  }
});
//
TransactionSchema.pre("save", async function (next) {
  this.modifiedDate = Date.now();
  next();
});

export { TransactionSchema, TransactionStatus };
