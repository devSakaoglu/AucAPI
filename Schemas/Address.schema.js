import mongoose from "mongoose";
import validator from "validator";

const AddressSchema = new mongoose.Schema({
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
  // zip: {
  //   type: String,
  //   required: true,
  //   default: "",
  //   // validator: {
  //   //   validator: (value) => {
  //   //     return !validator.isPostalCode(value, "any");
  //   //   },
  //   //   message: "Zip code is not valid",
  //   // },
  // },
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
    required: True,
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
