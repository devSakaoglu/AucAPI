import mongoose from "mongoose";
import validator from "validator";
const TransactionStatus = Object.freeze({
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
    validator: (value) => {
      if (value < 0 && value < 1000000) {
        throw new Error("Price must be a positive number");
      }
    },
  },
  paymentIntentId: {
    type: String,
    required: true,
    validator: (value) => {
      if (!validator.isUUID(value)) {
        throw new Error("Payment intent ID is not valid");
      }
    },
  },
  status: {
    enum: Object.values(TransactionStatus),
    type: String,
    required: true,
    default: TransactionStatus.Pending,
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
