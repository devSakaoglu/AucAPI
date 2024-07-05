import express from "express";
import { AppUser, Transaction, Product } from "../Db.js";
import { TransactionStatus } from "../Schemas/Transaction.schema.js";
import authMiddleware from "./midleware/auth.js";
import stripe from "../api/midleware/stripe.js"; // Import Stripe configuration

const TransactionRouter = express.Router();
TransactionRouter.use(express.json());

// Router Test Endpoint
TransactionRouter.get("/test", (req, res) => {
  res.json("Transaction working");
});

// Create Transaction with Payment
TransactionRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, price, token } = req.body;

    const product = await Product.findById(productId);

    const seller = await AppUser.findById(product.appUser);

    const buyer = await AppUser.findById(req.appUser._id);

    if (product.productStatus !== "Reserved") {
      return res.status(400).send("Product is not Reserved");
    }

    if (!product || !seller) {
      return res.status(404).send("Product or seller not found");
    }

    if (seller._id.equals(buyer._id)) {
      return res.status(400).send("You can't buy your own product");
    }

    if (price !== product.maxBidPrice) {
      return res.status(400).send(" Price is not equal to max bid price");
    }

    const charge = await stripe.charges.create({
      amount: price * 100,
      currency: "usd",
      source: token, //"tok_visa"
    });

    const transaction = new Transaction({
      product: productId,
      buyer: buyer._id,
      seller: seller._id,
      price,
      paymentIntentId: charge.id, // Store the payment intent ID
      status: TransactionStatus.Completed,
    });
    product.productStatus = "Sold";
    await product.save();

    await transaction.save();
    res.status(201).send({ transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default TransactionRouter;
