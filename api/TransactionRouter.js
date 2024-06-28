import express from "express";
import { AppUser, Transaction, Product } from "../Db.js";
import { TransactionStatus } from "../Schemas/Transaction.schema.js";
import authMiddleware from "./midleware/auth.js";
import dotenv from "dotenv";
dotenv.config();

const TransactionRouter = express.Router();
TransactionRouter.use(express.json());

// Router Test Endpoint
TransactionRouter.get("/test", (req, res) => {
  res.json("Transaction working");
});

// Create Transaction
TransactionRouter.post("/transactions", async (req, res) => {
  try {
    const { productId, price, sellerId } = req.body;
    const product = await Product.findById(productId);
    const seller = await AppUser.findById(sellerId);
    const buyer = await AppUser.findById(req.appUser._id);
    if (!product || !seller) {
      return res.status(404).send("Product or seller not found");
    }
    if (product.status !== "Active") {
      return res.status(400).send("Product is not available");
    }
    if (seller._id === buyer._id) {
      return res.status(400).send("You can't buy your own product");
    }
    if (price < product.lastBidPrice) {
      return res.status(400).send("Price is lower than the product price");
    }
    const transaction = Transaction({
      product: productId,
      buyer: buyer._id,
      seller: sellerId,
      price,
    });
    const wait = await transaction.pendingTransaction();
    if (wait) {
      await transaction.save();
      res.status(201).json({ transaction });
    }
    res.status(201).json({ transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
TransactionRouter.post("/createTest", authMiddleware, async (req, res) => {
  try {
    const transaction = new Transaction({
      buyer: req.appUser._id,
      price: req.body.price,
      product: req.body.product,
      seller: req.body.seller || (await AppUser.findOne({ role: "AppUser" })),
    });

    const testvalue = await transaction.changeStatus(TransactionStatus.Pending);
    console.log({ test: testvalue });
    await transaction.save();
    res.status(201).json({ transaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default TransactionRouter;
