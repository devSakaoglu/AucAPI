import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppUser } from "../Db.js";
import authMiddleware from "./midleware/auth.js";
import cors from "cors";

const AppUserRouter = express.Router();

AppUserRouter.use(express.json());

// SIGNUP Endpoint
AppUserRouter.post("/signup", async (req, res) => {
  const { email, password, name, surname, phone } = req.body;
  try {
    const existingUser = await AppUser.findOne({ email });
    if (existingUser) {
      return res.status(400).send("AppUser already exists");
    }
    const appUser = new AppUser({
      name,
      surname,
      email,
      phone,
      password,
    });
    await appUser.save();
    const token = jwt.sign({ email: appUser.email, id: appUser._id }, "test", {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
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
      return res.status(414).send("AppUser does not exist");
    }
    console.log(password);
    console.log(appUser.password);
    // const isPasswordCorrect = await bcrypt.compare(password, appUser.password);
    // if (!isPasswordCorrect) {
    //   return res.status(400).send("Invalid credentials");
    // }
    const token = jwt.sign({ email: appUser.email, id: appUser._id }, "test", {
      expiresIn: "1d",
    });
    res.status(200).json({ appUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CRUD Endpoints for AppUser
// GET all users
AppUserRouter.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await AppUser.find();
    console.log(users);

    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// GET a single AppUser by ID
AppUserRouter.get("/users/:id", async (req, res) => {
  try {
    const appUser = await AppUser.findById(req.params.id);
    if (!alertppUser) {
      return res.status(404).send("AppUser not found");
    }
    res.json(appUser);
  } catch (error) {
    res.status(500).send("Error fetching AppUser");
  }
});

// UPDATE a AppUser
AppUserRouter.patch("/users/:id", async (req, res) => {
  try {
    const updatedUser = await AppUser.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send("Error updating AppUser");
  }
});

// DELETE a AppUser
AppUserRouter.delete("/users/:id", async (req, res) => {
  try {
    await AppUser.findByIdAndDelete(req.params.id);
    res.send("AppUser deleted");
  } catch (error) {
    res.status(500).send("Error deleting AppUser");
  }
});

export default AppUserRouter;
