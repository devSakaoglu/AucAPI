import mongoose from "mongoose";

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
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  modifiedDate: {
    type: Date,
    required: true,
    default: null,
  },
  status: {
    type: Object.values(TransactionStatus),
    required: true,
    default: TransactionStatus.Pending,
  },
});
const TransactionStatus = {
  default: "default",
  Pending: "Pending",
  Completed: "Completed",
  Cancelled: "Cancelled",
};
export default { TransactionSchema, TransactionStatus };

//update modified date
TransactionSchema.methods.updateModifiedDate = async function () {
  this.modifiedDate = Date.now();
  await this.save();
};
TransactionSchema.methods.completeTransaction = async function () {
  this.status = TransactionStatus.Completed;
  await this.updateModifiedDate();
};
TransactionSchema.methods.cancelTransaction = async function () {
  this.status = TransactionStatus.Cancelled;
  await this.updateModifiedDate();
};
//update transaction
TransactionSchema.methods.update = async function (data) {
  Object.keys(data).forEach((key) => {
    this[key] = data[key];
  });
  this.modifiedDate = Date.now();
  await this.updateModifiedDate();
};
