import express from "express";
import { Bid, AppUser, Product } from "../Db.js";
import authMiddleware from "./midleware/auth.js";

const BidRouter = express.Router();
BidRouter.use(express.json());

// BidRouter.post("/", authMiddleware, async (req, res) => {
//   try {
//     const sellerUser = await Product.findById(req.body.product).populate(
//       "appUser"
//     );
//     const newBid = new Bid({
//       appUser: req.appUser._id,
//       product: req.body.product,
//       bidPrice: req.body.bidPrice,
//       sellerUser: sellerUser.appUser._id,
//     });

//     const savedBid = await newBid.save();
//     res.status(201).json(savedBid);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
BidRouter.post("/:id", authMiddleware, async (req, res) => {
  try {
    if (
      req.appUser.listedProducts.findIndex(
        (id) => id.toString() == req.params.id
      ) != -1
    ) {
      return res
        .status(400)
        .json({ message: "You cannot bid on your own product" });
    }

    const product = await Product.findById(req.params.id).populate("bids");

    if (new Date(product.auctionEndDate) < Date.now()) {
      return res.status(400).json({ message: "Auction has ended" });
    }

    const maxBid = product.bids.sort((a, b) => b.bidPrice - a.bidPrice)[0] || {
      bidPrice: 0,
    };
    if (req.body.bidPrice <= maxBid.bidPrice) {
      return res
        .status(400)
        .json({ message: "Bid price is lower than max bid price" });
    }
    const newBid = new Bid({
      appUser: req.appUser._id,
      product: product._id,
      sellerUser: product.appUser,
      bidPrice: req.body.bidPrice,
    });

    const savedBid = await newBid.save();
    req.appUser.bids.push(savedBid._id);
    product.bids.push(savedBid._id);
    await product.save();
    await req.appUser.save();
    res.status(201).json(newBid);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET all bids
BidRouter.get("/", async (req, res) => {
  try {
    const bids = await Bid.find();
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a specific bid by ID
BidRouter.get("/:id", async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    if (bid == null) {
      return res.status(404).json({ message: "Cannot find bid" });
    }
    res.json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a bid
BidRouter.patch("/:id", async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    if (bid == null) {
      return res.status(404).json({ message: "Cannot find bid" });
    }
    if (req.body.appUser != null) {
      bid.appUser = req.body.appUser;
    }
    if (req.body.product != null) {
      bid.product = req.body.product;
    }
    if (req.body.bidPrice != null) {
      bid.bidPrice = req.body.bidPrice;
    }
    // if (req.body.bidTime != null) {
    //   bid.bidTime = req.body.bidTime;
    // }
    const updatedBid = await bid.save();
    res.json(updatedBid);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a bid
BidRouter.delete("/:id", async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    if (bid == null) {
      return res.status(404).json({ message: "Cannot find bid" });
    }
    await bid.remove();
    res.json({ message: "Deleted Bid" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default BidRouter;
