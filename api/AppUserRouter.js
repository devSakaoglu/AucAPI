import express from "express";
import jwt from "jsonwebtoken";
import { AppUser } from "../Db.js";
import authMiddleware from "./midleware/auth.js";
import bcrypt from "bcrypt";

const AppUserRouter = express.Router();
AppUserRouter.use(express.json());

// Router Test Endpoint
AppUserRouter.get("/login", (req, res) => {
  res.json("Login working");
});
AppUserRouter.get("/me", authMiddleware, (req, res) => {
  res.json(req.appUser);
});
AppUserRouter.post("/signup", async (req, res) => {
  try {
    const existingUser = await AppUser.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("AppUser already exists");
    }
    const appUser = new AppUser({
      ...req.body,
    });
    console.log({ ...req.body });
    await appUser.save();
    const token = jwt.sign(
      { email: appUser.email, id: appUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    req.session = { jwt: token };
    res.status(201).json({ appUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN Endpoint
AppUserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const appUser = await AppUser.findOne({ email });
    if (!appUser) {
      return res.status(444).send("AppUser does not exist");
    }
    const isPasswordCorrect = await bcrypt.compare(password, appUser.password); //Todo service
    if (!isPasswordCorrect) {
      return res.status(400).send("Invalid credentials");
    }

    const token = jwt.sign(
      { email: appUser.email, id: appUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
    req.session = { jwt: token };
    res.status(200).json({ appUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGOUT Endpoint
AppUserRouter.post(
  "/logout",
  /*authMiddleware ,*/ (req, res) => {
    console.log("Session before logout :", req.session);
    req.session = null;
    console.log(
      "Session is cleared :",
      req.session == null
        ? "session is empty"
        : "There is a problem with the session"
    );

    res.status(200).send({ message: "Logout successful" });
  }
);

// GET all users
AppUserRouter.get(
  "/users",
  /*authMiddleware,*/ async (req, res) => {
    try {
      const users = await AppUser.find();
      console.log(users);

      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  }
);

// GET a single AppUser by ID
AppUserRouter.get("/users/:id", async (req, res) => {
  try {
    const appUser = await AppUser.findById(req.params.id);
    if (!appUser) {
      return res.status(404).send("AppUser not found");
    }
    res.json({ appUser });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// UPDATE a AppUser
AppUserRouter.patch("/users", authMiddleware, async (req, res) => {
  try {
    const updatedUser = await AppUser.findByIdAndUpdate(
      req.appUser.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// DELETE a AppUser
AppUserRouter.delete("/users", authMiddleware, async (req, res) => {
  try {
    const appUser = await AppUser.findByIdAndDelete(req.appUser.id);
    if (!appUser) {
      return res.status(404).send("AppUser not found");
    }
    req.session = null;
    res.send({ "AppUser ": appUser });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default AppUserRouter;
