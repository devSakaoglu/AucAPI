import express from "express";
import mongoose from "mongoose";
import { Product } from "../Db.js";

const ProductRouter = express.Router();


// Add a new product

ProductRouter.post ("/product",async (req, res) => {
    const { appUser, bids, name, description, startPrice, tags, category, quantity } = req.body;
    try {
        const newProduct = new Product({ 
            appUser, 
            bids, 
            name, 
            description, 
            startPrice, 
            tags, 
            category, 
            quantity 
        });
        await newProduct.save();
        res.status(201).send(newProduct);
    } catch (error) {
        res.status(400).send(error);
    }
});
// Get all products
ProductRouter.get ("/product",async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a product by ID
ProductRouter.get ("/product:id",async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send();
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a product
ProductRouter.patch ("/product:id",async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'startPrice', 'tags', 'category', 'quantity'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).send();
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a product
ProductRouter.delete ("/product:id",async (req, res) => {
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
ProductRouter.get ("/product/search",async (req, res) => {
    try {
        // Retrieve the tag from query parameters
        const { tag } = req.query;
        // Find products that have the specified tag in their tags array
        const products = await Product.find({ tags: tag });
        if(products.length === 0) {
            return res.status(404).send('No products found with the specified tag.');
        }
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default ProductRouter;