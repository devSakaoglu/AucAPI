import jwt from "jsonwebtoken";
import { AppUser } from "../../Db.js";

const authMiddleware = async (req, res, next) => {
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
};

export default authMiddleware;
