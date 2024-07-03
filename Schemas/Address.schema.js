import mongoose from "mongoose";
import validator from "validator";

const AddressSchema = new mongoose.Schema({
  appUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    required: true,
  },
  city: {
    type: String,
    required: true,
    default: "",
    validator: {
      validator: (value) => {
        return validator.isAlpha(value);
      },
      message: "City name is not valid",
    },
  },
  street: {
    type: String,
    required: true,
    default: "",
    validator: {
      validator: (value) => {
        return validator.isAlpha(value);
      },
      message: "Street name is not valid",
    },
  },

  country: {
    type: String,
    required: true,
    default: "",
    validator: {
      validator: (value) => {
        return validator.isAlpha(value);
      },
      message: "Country name is not valid",
    },
  },
  description: {
    type: String,
    required: true,
    default: "",
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

export default AddressSchema;
