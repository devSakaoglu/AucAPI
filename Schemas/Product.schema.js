import mongoose from "mongoose";
import validator from "validator";
const auctionDuration = Object.freeze({
  oneDay: 1,
  oneWeek: 7,
  oneMonth: 30,
});
const productStatus = Object.freeze({
  active: "Active",
  inactive: "Inactive",
  sold: "Sold",
  expired: "Expired",
  deleted: "Deleted",
});
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

const ProductSchema = new mongoose.Schema({
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
    required: false,
  },
  startPrice: {
    type: Number, //number check
    required: true,
  },
  lastBidPrice: {
    type: Number,
    required: false,
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
  productStatus: {
    enum: Object.values(productStatus),
    type: String,
    required: true,
    default: productStatus.active,
  },
  images: {
    type: [String],
    required: false,
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
  auctionStartDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  auctionDuration: {
    enum: Object.values(auctionDuration),
    type: String,
    required: true,
    default: auctionDuration.oneDay,
  },
  auctionEndDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

ProductSchema.pre("save", function (next) {
  this.modifiedDate = Date.now();
  next();
});

export default ProductSchema;
