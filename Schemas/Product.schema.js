import mongoose from "mongoose";

const tags = [
  "New",
  "Used",
  "Refurbished",
  "Vintage",
  "Antique",
  "Rare",
  "Limited Edition",
  "Mint Condition",
  "Good Condition",
  "Fair Condition",
  "For Parts",
  "Electronics",
  "Fashion",
  "Home and Garden",
  "Art",
  "Collectibles",
  "Sports and Hobbies",
  "Books",
  "Vehicles",
  "Jewelry",
  "Gifts",
  "Holiday",
  "Wedding",
  "Birthday",
  "Anniversary",
  "Kids",
  "Teens",
  "Adults",
  "For Men",
  "For Women",
  "For Pets",
  "Eco-Friendly",
  "Upcycled",
  "Recycled",
  "Local",
  "Imported",
  "Handmade",
];

const productSchema = new mongoose.Schema({
  appUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    required: true,
  },
  bids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Bid",
    required: false,
  },
  name: {
    type: String, //string check
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startPrice: {
    type: Number, //number check
    required: true,
  },

  tags: {
    type: [String], //string check
    required: false,
    validate: {
      validator: function (v) {
        return v.every((tag) => tags.includes(tag));
      },
    },
  },
  category: {
    type: [String], //enum or string check
    required: true,
  },
  quantity: {
    // add details about the quantity
    type: Number,
    required: false,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  modifiedTime: {
    type: Date,
    default: Date.now,
  },
});

export default productSchema;
