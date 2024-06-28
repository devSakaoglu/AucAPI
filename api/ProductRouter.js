import express from "express";
import { Product } from "../Db.js";
import authMiddleware from "./midleware/auth.js";
import { AppUser } from "../Db.js";
const ProductRouter = express.Router();

// Add a new product
ProductRouter.post("/product", authMiddleware, async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      appUser: req.appUser._id,
    });
    await newProduct.save();

    // const appUser = await AppUser.findById(req.appUser._id);
    // appUser.listedProducts.push(newProduct._id);
    // await appUser.save();

    res.status(201).send({ newProduct });
  } catch (error) {
    res.status(400).send(error);
  }
});
// Get all products
ProductRouter.get("/product", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});
ProductRouter.get("/products/me", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ appUser: req.appUser._id });
    const produtcs2 = [products, products];
    res.status(200).send(produtcs2);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a product by ID
ProductRouter.get("/product/:id", async (req, res) => {
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
ProductRouter.patch("/product:id", authMiddleware, async (req, res) => {
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
ProductRouter.delete("/product:id", async (req, res) => {
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
ProductRouter.get("/product/search", async (req, res) => {
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
ProductRouter.get("/products/searchByNameOrDescription", async (req, res) => {
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

export default ProductRouter;
