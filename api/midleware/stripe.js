import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51P2HbeDrUQTHv2dXFvd9N9LQYXIZE6JqKpOHg3NjpyLuCvxAcuyT59vfC3GOYPb9QMly5Ld7EzT38hDNyB16UhnP00pg6LMUTr",
  {
    apiVersion: "2024-06-20", // Make sure this matches your Stripe API version
  }
);

export default stripe;
