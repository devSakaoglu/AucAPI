import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51PXkqiRtHxj5IITRfR1ENt2R5M88AsEdJ6bPlmIFSTpigOIkNfFelB6UoDpLL48FUFKjoVgQ51ieg8GLyDMSoIM600P5NEyquH', {
  apiVersion: '2024-06-20', // Make sure this matches your Stripe API version
});

export default stripe;
