import express from "express";
import { Address, AppUser } from "../Db.js";
import authMiddleware from "./midleware/auth.js";

const AddressRouter = express.Router();
AddressRouter.use(express.json());

AddressRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const address = await Address.findOne({ userId: req.appUser._id });
    res.json(address);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

AddressRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const address = new Address({
      ...req.body,
      appUser: req.appUser._id,
    });
    const user = await AppUser.findById(req.appUser._id);

    const newAddress = await address.save();
    if (newAddress) {
      user.Addresses = newAddress._id;
      await user.save();

      console.log("newAddress", "Updated");
    }

    res.status(201).json("newAddress");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

AddressRouter.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedAddress) {
      return res.status(404).send();
    }
    res.status(200).send(updatedAddress);
  } catch (error) {
    res.status(400).send(error);
  }
});

AddressRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).send("Address not found.");
    } else {
      const result = await Address.findByIdAndDelete(req.params.id);
      if (!result) {
        return res.status(404).send("Address not found.");
      } else {
        return res
          .status(200)
          .send({ message: "Address deleted successfully.", address });
      }
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

export default AddressRouter;
