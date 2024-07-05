import express from "express";
import jwt from "jsonwebtoken";
import { AppUser, Product, Address } from "../Db.js";
import authMiddleware from "./midleware/auth.js";
import bcrypt from "bcrypt";

const AppUserRouter = express.Router();
AppUserRouter.use(express.json());

// Router Test Endpoint
AppUserRouter.get("/login", (req, res) => {
  res.json("Login working");
});
AppUserRouter.get("/me", authMiddleware, async (req, res) => {
  const appUserAndAddress = await AppUser.findById(req.appUser._id).populate({
    path: "Addresses",
    select: "street city country description",
  });
  res.status(200).json(appUserAndAddress);
});
AppUserRouter.post("/signup", async (req, res) => {
  try {
    if (req.session?.jwt !== undefined) {
      return res.status(400).send("Already logged in");
    }

    const existingUser = await AppUser.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("AppUser already exists");
    }
    const appUser = new AppUser({
      ...req.body,
    });
    await appUser.save();
    const token = jwt.sign(
      { email: appUser.email, id: appUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    // req.session = { jwt: token };
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
    req.session = null;

    res.status(200).send({ message: "Logout successful" });
  }
);
AppUserRouter.get("/reservedProducts", authMiddleware, async (req, res) => {
  try {
    const reservedProducts = await Product.find({
      maxBidPriceUser: req.appUser.id,
      productStatus: "Reserved",
    });

    res.json(reservedProducts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET all users
AppUserRouter.get(
  "/users",
  /*authMiddleware,*/ async (req, res) => {
    try {
      const users = await AppUser.find();

      res.json(users);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
AppUserRouter.post("/address", authMiddleware, async (req, res) => {
  try {
    const address = new Address({
      ...req.body,
    });

    const newAdress = await address.save();

    if (newAdress) {
      await AppUser.findByIdAndUpdate(req.appUser.id, {
        address: newAdress._id,
      });
    }

    res.status(201).json({ address });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

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
