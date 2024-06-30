// auth.js
import jwt from "jsonwebtoken";
import { AppUser } from "../../Db.js";
// import dotenv from "dotenv";
// dotenv.config();
// Import any necessary dependencies
// For example, if you're using Express.js:
// const jwt = require('jsonwebtoken');
// Define your authentication middleware function
const authMiddleware = async (req, res, next) => {
  // Check if the user is authenticated
  // For example, if you're using JWT authentication:

  if (!req.session?.jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_SECRET);
    // console.log("Payload", payload);
    // const token = req.headers.authorization.replace("Bearer ", "");

    const appUser = await AppUser.findOne({ _id: payload.id });
    if (!appUser) {
      return res.status(404).send("AppUser does not exist");
    }
    req.token = req.session.jwt;
    req.appUser = appUser;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }

  // Replace the above code with your own authentication logic

  // If the user is authenticated, call next() to proceed to the next middleware or route handler
};

// Export the middleware function
export default authMiddleware;
