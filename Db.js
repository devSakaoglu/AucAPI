import mongoose from "mongoose";
import userSchema from "./Schemas/AppUser.schema.js";
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
const User = mongoose.model("User", userSchema);

export { User };
