import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";

const AppUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must be at least 3 characters"],
  },
  surname: {
    type: String,
    required: true,
    minLength: [3, "Surname must be at least 3 characters"],
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return validator.isMobilePhone(value, "any");
      },
      message: "Phone number is not valid",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: "Email is not valid",
    },
  },
  password: {
    type: String,
    required: true,
  },
  listedProducts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    required: false,
    default: [],
  },
  bids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Bid",
    required: false,
    default: [],
  },
  purchasedProducts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    required: false,
    default: [],
  },
});
AppUserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});
AppUserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};
export default AppUserSchema;
