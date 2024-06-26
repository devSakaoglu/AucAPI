import mongoose from "mongoose";
import AppUserSchema from "./Schemas/AppUser.schema.js";
import bidSchema from "./Schemas/Bid.schema.js";
import productSchema from "./Schemas/Product.schema.js";
import addressSchema from "./Schemas/Address.schema.js";
// MongoDB connection URL
const mongoURL =
  "mongodb+srv://mtsakaoglu:KAeDnvShvUf9DpY0@aucmongodb.krps0oo.mongodb.net/?retryWrites=true&w=majority&appName=AucMongoDb";

// Connect to MongoDB
mongoose
  .connect(mongoURL, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Models intergration
const AppUser = mongoose.model("AppUser", AppUserSchema);
const Bid = mongoose.model("Bid", bidSchema);
const Product = mongoose.model("Product", productSchema);
const Address = mongoose.model("Address", addressSchema);

export { AppUser, Bid, Product, Address };
