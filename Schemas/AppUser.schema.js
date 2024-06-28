import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";

const AppUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must be at least 3 characters"],
    trim: true,
    validate: {
      validator: (value) => {
        if ((value.match(/ /g) || []).length > 2) {
          return false;
        }
        return RegExp(/^[a-zA-Z\s]+$/).test(value);
      },
      message: "Name must contain only letters and two spaces",
    },
  },
  surname: {
    type: String,
    required: true,
    minLength: [3, "Surname must be at least 3 characters"],
    validate: {
      validator: (value) => {
        if ((value.match(/ /g) || []).length > 2) {
          return false;
        }
        return RegExp(/^[a-zA-Z\s]+$/).test(value);
      },
      message: "Name must contain only letters and two spaces",
    },
  },
  //fix it
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
  address: {
    type: [String],
    required: false,
    default: "",
  },
  Address: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Address",
    required: false,
    default: [],
  },
  role: {
    type: String,
    required: true,
    default: "AppUserRole",
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
AppUserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.modifiedDate = Date.now();
  next();
});
AppUserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};
export default AppUserSchema;
