import mongoose from "mongoose";
import AppUserSchema from "./Schemas/AppUser.schema.js";
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

// Models integration3
const AppUser = mongoose.model("AppUser", AppUserSchema);

export { AppUser };
