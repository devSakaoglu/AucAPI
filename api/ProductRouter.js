import express from "express";
import { Product } from "../Db.js";
import authMiddleware from "./midleware/auth.js";
import upload from "./midleware/file.js";
import sharp from "sharp";

const ProductRouter = express.Router();
const Day = 1000 * 60 * 60 * 24;

// Consider and implement the following routes:

ProductRouter.post(
  "/",
  authMiddleware,
  upload.array("images"),

  async (req, res) => {
    try {
      const images = await Promise.all(
        req.files.map(async (file) => {
          return file.filename;
        })
      );
      const newProduct = new Product({
        ...req.body,
        quantity: Number(req.body.quantity) || 1,
        startPrice: Number(req.body.startPrice) || 0,
        auctionDuration: Number(req.body.auctionDuration) || 1,
        appUser: req.appUser._id,
        auctionEndDate: new Date(
          Date.now() + Day * (req.body.auctionDuration || 1)
        ),
        images: images,
        s,
      });
      await newProduct.save();
      res.status(201).send({ newProduct });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  }
);

// Get all products
ProductRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

ProductRouter.get("/me", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ appUser: req.appUser._id });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a product by ID
ProductRouter.get("/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const product = await Product.findById(req.params.id);
    // product.populate("appUser").execPopulate();
    // await product.populate("appUser", "-_id");
    await product.populate({
      path: "appUser",
      select: { name: 1, surname: 1, _id: 1 },
    });
    if (!product) {
      return res.status(404).send();
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a product
ProductRouter.patch(":id", authMiddleware, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "description",
    "startPrice",
    "tags",
    "category",
    "quantity",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).send();
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a product
ProductRouter.delete(":id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Search by tag
ProductRouter.get("/search", async (req, res) => {
  try {
    // Retrieve the tag from query parameters
    const { tag } = req.query;
    // Find products that have the specified tag in their tags array
    const products = await Product.find({ tags: tag });
    if (products.length === 0) {
      return res.status(404).send("No products found with the specified tag.");
    }
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Search products by name or description
ProductRouter.get("/searchByNameOrDescription", async (req, res) => {
  try {
    const { query } = req.query;
    // Using a regular expression to perform a case-insensitive and partial match search
    const searchRegex = new RegExp(query, "i");
    const products = await Product.find({
      $or: [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ],
    });
    if (products.length === 0) {
      return res.status(404).send("No products found matching the query.");
    }
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});
ProductRouter.post("/test", authMiddleware, async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      appUser: req.appUser._id,
      auctionEndDate: new Date(
        Date.now() + Day * (req.body.auctionDuration || 1)
      ),
    });
    await newProduct.save();
    res.status(201).send({ newProduct });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default ProductRouter;
