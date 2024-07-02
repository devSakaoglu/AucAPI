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
    const { productId, price } = req.body;
    console.log(req.body);
    const product = await Product.findById(productId);
    console.log(product);

    const seller = await AppUser.findById(product.appUser);
    console.log(seller);

    const buyer = await AppUser.findById(req.appUser._id);
    console.log(buyer);

    if (!product || !seller) {
      return res.status(404).send("Product or seller not found");
    }

    if (product.status === "Active") {
      return res.status(400).send("Product is not available");
    }

    if (seller._id.equals(buyer._id)) {
      return res.status(400).send("You can't buy your own product");
    }

    if (price < product.lastBidPrice) {
      return res.status(400).send("Price is lower than the product price");
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100, // Convert the price to cents
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        integration_check: "accept_a_payment",
        buyer: buyer._id.toString(),
        seller: seller._id.toString(),
        product: productId.toString(),
      },
    });
    console.log(paymentIntent);

    const transaction = new Transaction({
      product: productId,
      buyer: buyer._id,
      seller: seller._id,
      price,
      paymentIntentId: paymentIntent.id, // Store the payment intent ID
      status: TransactionStatus.Pending,
    });

    await transaction.save();
    res
      .status(201)
      .send({ transaction, clientSecret: paymentIntent.client_secret });
    //   .status(201)
    //   .json({ transaction, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Webhook to handle Stripe payment status updates
// This is an example of how to handle a Stripe webhook
// You should implement your own webhook handler
TransactionRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, "whsec_...");
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        // Find the transaction and update its status
        const transaction = await Transaction.findOne({
          paymentIntentId: paymentIntent.id,
        });
        if (transaction) {
          transaction.status = TransactionStatus.Completed;
          await transaction.save();
        }
        break;
      case "payment_intent.payment_failed":
        const paymentFailedIntent = event.data.object;
        // Find the transaction and update its status
        const failedTransaction = await Transaction.findOne({
          paymentIntentId: paymentFailedIntent.id,
        });
        if (failedTransaction) {
          failedTransaction.status = TransactionStatus.Failed;
          await failedTransaction.save();
        }
        break;
      // Handle other event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

// TransactionRouter.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   async (req, res) => {
//     const sig = req.headers["stripe-signature"];

//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         "your-webhook-secret"
//       );
//     } catch (err) {
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // Handle the event
//     switch (event.type) {
//       case "payment_intent.succeeded":
//         const paymentIntent = event.data.object;
//         // Find the transaction and update its status
//         const transaction = await Transaction.findOne({
//           paymentIntentId: paymentIntent.id,
//         });
//         if (transaction) {
//           transaction.status = TransactionStatus.Completed;
//           await transaction.save();
//         }
//         break;
//       case "payment_intent.payment_failed":
//         const paymentFailedIntent = event.data.object;
//         // Find the transaction and update its status
//         const failedTransaction = await Transaction.findOne({
//           paymentIntentId: paymentFailedIntent.id,
//         });
//         if (failedTransaction) {
//           failedTransaction.status = TransactionStatus.Failed;
//           await failedTransaction.save();
//         }
//         break;
//       // Handle other event types as needed
//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }

//     res.json({ received: true });
//   }
// );

export default TransactionRouter;
