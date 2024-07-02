import Stripe from "stripe";

const stripe = new Stripe(
  "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",
  {
    apiVersion: "2024-06-20", // Make sure this matches your Stripe API version
  }
);

export default stripe;
