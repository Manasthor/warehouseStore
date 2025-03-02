import express, { json } from 'express';
import './DB/config.js';
import Cors from 'cors';
import User from './DB/User.js';
import Product from './DB/Product.js';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
// import path from 'path';
// import { fileURLToPath } from 'url';
dotenv.config();
const app = express();
app.use(json());
app.use(Cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

const jwtKey = process.env.jwtKey;

app.get("/", (req, res) => {
    res.send("Warehouse Store Backend is running!");
});

app.post('/register', async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    Jwt.sign({ result }, jwtKey, (err, token) => {
        if (err) {
            return resp.send(err);
        }
        resp.send({result, auth: token});
    });
});

app.post('/login', async (req, resp) => {
    if (req.body.email && req.body.password) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, jwtKey, (err, token) => {
                if (err) {
                    return resp.send(err);
                }
                resp.send({user, auth: token});
            });
        } else {
            resp.send("Invalid credentials");
        }

    } else {
        return resp.send("Please provide email and password");
    }
});

app.post('/addProduct',verifyToken, async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result);
});

app.get('/products',verifyToken, async (req, res) => {
    let products = await Product.find();
    if (products.length > 0) {
        res.send(products);
    } else {
        res.send({ result: "No products found" });
    }
});

app.delete('/delproduct/:id',verifyToken, async (req, res) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    res.send(result)
});

app.get('/upproduct/:id',verifyToken, async (req, res) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        res.send(result);
    } else {
        res.send({ result: "No product found" });
    }
});

app.put('/inproduct/:id',verifyToken, async (req, res) => {
    let result = await Product.updateOne({ _id: req.params.id }, { $set: req.body });
    res.send(result);
});

app.get('/search/:key',verifyToken, async (req, res) => {
    let result = await Product.find(
        {
            "$or": [
                { name: { $regex: req.params.key, $options: "i" } },
                { price: { $regex: req.params.key, $options: "i" } },
                { company: { $regex: req.params.key, $options: "i" } },
                { category: { $regex: req.params.key, $options: "i" } }
            ]
        }
    )
    res.send(result);
});

app.get('/user/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId).select("name email");
    if (!user) {
        res.status(404).json({ message: "No user found" });
    } else {
        res.status(200).json(user);
    }
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        Jwt.verify(req.token, jwtKey, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
