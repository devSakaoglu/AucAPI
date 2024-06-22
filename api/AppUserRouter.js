import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { AppUser } from "../Db.js";

const router = express.Router();

router.use(express.json());

mongoose.connect("mongodb://localhost:27017/yourDatabaseName", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// SIGNUP Endpoint
router.post("/signup", async (req, res) => {
  const { email, password, name, surname, phone } = req.body;
  try {
    const existingUser = await AppUser.findOne({ email });
    if (existingUser) {
      return res.status(400).send("AppUser already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const appUser = new AppUser({
      name,
      surname,
      email,
      phone,
      password: hashedPassword,
    });
    await AppUser.save();
    const token = jwt.sign({ email: AppUser.email, id: AppUser._id }, "test", {
      expiresIn: "1h",
    });
    res.status(201).json({ AppUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// LOGIN Endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const appUser = await AppUser.findOne({ email });
    if (!AppUser) {
      return res.status(404).send("AppUser does not exist");
    }
    const isPasswordCorrect = await bcrypt.compare(password, AppUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).send("Invalid credentials");
    }
    const token = jwt.sign({ email: AppUser.email, id: AppUser._id }, "test", {
      expiresIn: "1h",
    });
    res.status(200).json({ AppUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// CRUD Endpoints for AppUser
// GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await AppUser.find();
    res.json(users);
  } catch (error) {
    res.status(500).send("Error fetching users");
  }
});

// GET a single AppUser by ID
router.get("/users/:id", async (req, res) => {
  try {
    const appUser = await AppUser.findById(req.params.id);
    if (!AppUser) {
      return res.status(404).send("AppUser not found");
    }
    res.json(AppUser);
  } catch (error) {
    res.status(500).send("Error fetching AppUser");
  }
});

// UPDATE a AppUser
router.patch("/users/:id", async (req, res) => {
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
router.delete("/users/:id", async (req, res) => {
  try {
    await AppUser.findByIdAndDelete(req.params.id);
    res.send("AppUser deleted");
  } catch (error) {
    res.status(500).send("Error deleting AppUser");
  }
});

export default router;
