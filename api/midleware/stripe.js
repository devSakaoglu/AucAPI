import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2024-06-20",
});

export default stripe;
