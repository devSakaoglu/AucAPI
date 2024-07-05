import express from "express";
import { Product } from "../Db.js";
import { productStatus } from "../Schemas/Product.schema.js";
import authMiddleware from "./midleware/auth.js";
import upload from "./midleware/file.js";

const Day = 1000 * 60 * 60 * 24;

const ProductRouter = express.Router();

// Consider and implement the following routes:
ProductRouter.get("/status", async (req, res) => {
  try {
    await Product.updateMany(
      {
        productStatus: "Active",
        auctionEndDate: { $lt: new Date(Date.now()).toISOString() },
        maxBidPriceUser: { $exists: false },
      },
      { productStatus: "Inactive" }
    );
    await Product.updateMany(
      {
        productStatus: "Active",
        auctionEndDate: { $lt: new Date(Date.now()).toISOString() },
        maxBidPriceUser: { $exists: true },
      },
      {
        productStatus: "Reserved",
      }
    );

    res.status(200).send({ message: "Status updated" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

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
      if (!req.body.name) {
        return res.status(400).send("Name is required");
      }
      const newProduct = new Product({
        ...req.body,
        maxBidPrice: req.body.startPrice,
        appUser: req.appUser._id,
        images: images,
      });

      if (req.body.auctionDuration === "") {
        newProduct.auctionDuration = 1;
      }
      if (!req.body.startPrice || req.body.startPrice === "") {
        newProduct.startPrice = 1;
        newProduct.maxBidPrice = 1;
      }
      if (newProduct.auctionDuration === 0) {
        newProduct.auctionEndDate = new Date(Date.now() + 60 * 5 * 1000);
      } else {
        newProduct.auctionEndDate = new Date(
          Date.now() + Day * Number(newProduct.auctionDuration)
        );
      }

      await newProduct.save();
      req.appUser.listedProducts.push(newProduct._id);
      await req.appUser.save();

      res.status(201).send({ newProduct });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

// Get all products
ProductRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find({
      auctionEndDate: { $gte: new Date(Date.now()).toISOString() },
      productStatus: "Active",
    }).populate({
      path: "appUser",
      select: "name surname",
    });

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

ProductRouter.get("/me/:status", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({
      appUser: req.appUser._id,
    });

    if (req.params.status === ":status") {
      res.status(200).send(products);
    } else if (Object.values(productStatus).includes(req.params.status)) {
      const filteredProducts = products.filter(
        (product) => product.productStatus === req.params.status
      );

      res.status(200).send(filteredProducts);
    } else {
      res.status(400).send("Invalid status");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get a product by ID
ProductRouter.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: "appUser",
        select: "name surname",
      })
      .populate({
        path: "bids",
        select: "-_id bidPrice",
        populate: {
          path: "appUser",
          select: "-_id name surname",
        },
      })
      .lean(); // Convert document to plain JavaScript object

    if (!product) {
      return res.status(404).send("Product not found.");
    }

    function obfuscateNameSurname(user) {
      if (user && user.name) {
        user.name = user.name.substring(0, 1) + "***";
      }
      if (user && user.surname) {
        user.surname = user.surname.substring(0, 1) + "***";
      }
    }

    // Obfuscate appUser fields in each bid
    product.bids.forEach((bid) => {
      obfuscateNameSurname(bid.appUser);
    });

    // Sort bids by bidPrice
    product.bids.sort((a, b) => b.bidPrice - a.bidPrice);

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
ProductRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ appUser: req.appUser._id });
    const product = products.find((product) => product._id == req.params.id);

    if (!product) {
      return res.status(404).send("Product not found.");
    } else if (product.productStatus === "Inactive") {
      const result = await Product.findByIdAndDelete(req.params.id);
      return res
        .status(200)
        .send({ message: "Product deleted successfully.", product });
    } else {
      return res.status(400).send("You can just  delete Inactive products.");
    }
  } catch (error) {
    return res.status(500).send(error);
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
