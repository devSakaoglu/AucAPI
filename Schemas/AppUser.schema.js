import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    required: false,
  },
  bids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Bid",
    required: false,
  },
  listedProducts: {
    type: [String],
    required: false,
  },
  purchasedProducts: {
    type: [String],
    required: false,
  },
});

export default userSchema;
