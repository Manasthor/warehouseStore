import express, { json } from 'express';
import './DB/config.js';
import cors from 'cors';
import User from './DB/User.js';
import Product from './DB/Product.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
app.use(json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Root Route
app.get("/", (req, res) => {
    res.send("Warehouse Store Backend is running!");
});

// Register User
app.post('/register', async (req, res) => {
    try {
        let user = new User(req.body);
        let result = await user.save();
        result = result.toObject();
        delete result.password;

        res.status(201).json({ user: result });
    } catch (error) {
        res.status(500).json({ error: "Registration failed", details: error.message });
    }
});

// Login User
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

        let user = await User.findOne({ email, password }).select("-password");
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        res.status(200).json({ user });

    } catch (error) {
        res.status(500).json({ error: "Login failed", details: error.message });
    }
});

app.post('/addProduct', async (req, res) => {
    try {
        const { name, price, category, userId, company, quantity } = req.body;

        const existingProduct = await Product.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            price,
            category: { $regex: new RegExp(`^${category}$`, 'i') },
            company: { $regex: new RegExp(`^${company}$`, 'i') },
            userId,
        });

        if (existingProduct) {
            existingProduct.quantity += parseInt(quantity);
            await existingProduct.save();
            res.status(200).json(existingProduct);
        } else {
            let product = new Product(req.body);
            let result = await product.save();
            res.status(201).json(result);
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to add/update product", details: error.message });
    }
});

// Get All Products
app.get('/products', async (req, res) => {
    try {
        let products = await Product.find().lean();
        if (products.length === 0) return res.status(404).json({ message: "No products found" });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products", details: error.message });
    }
});

// Delete Product
app.delete('/delproduct/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }
        let result = await Product.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) return res.status(404).json({ error: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete product", details: error.message });
    }
});

// Get Product by ID
app.get('/products/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }
        let result = await Product.findById(req.params.id).lean();
        if (!result) return res.status(404).json({ error: "Product not found" });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch product", details: error.message });
    }
});

// Update Product
app.put('/products/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }
        let result = await Product.updateOne({ _id: req.params.id }, { $set: req.body });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to update product", details: error.message });
    }
});

// Search Products
app.get('/search/:key', async (req, res) => {
    try {
        let result = await Product.find({
            "$or": [
                { name: { $regex: req.params.key, $options: "i" } },
                { price: { $regex: req.params.key, $options: "i" } },
                { company: { $regex: req.params.key, $options: "i" } },
                { category: { $regex: req.params.key, $options: "i" } }
            ]
        }).lean();
        if (result.length === 0) return res.status(404).json({ message: "No products found" });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to search products", details: error.message });
    }
});

// Get User by ID
app.get('/user/:userId', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const user = await User.findById(req.params.userId).select("name email").lean();
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user", details: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});