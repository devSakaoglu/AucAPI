// auth.js
import jwt from "jsonwebtoken";
import { AppUser } from "../../Db.js";

// Import any necessary dependencies
// For example, if you're using Express.js:
// const jwt = require('jsonwebtoken');

// Define your authentication middleware function
const authMiddleware = async (req, res, next) => {
  // Check if the user is authenticated
  // For example, if you're using JWT authentication:
  const token = req.headers.authorization.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, "test");
    const appUser = await AppUser.findOne({ _id: decoded.id });
    if (!appUser) {
      return res.status(404).send("AppUser does not exist");
    }
    req.token = token;
    req.appUser = appUser;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Replace the above code with your own authentication logic

  // If the user is authenticated, call next() to proceed to the next middleware or route handler
};

// Export the middleware function
export default authMiddleware;
