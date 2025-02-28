import express, { json } from 'express';
import './DB/config.js';
import Cors from 'cors';
import User from './DB/User.js';
import Product from './DB/Product.js';
const app = express();
app.use(json());
app.use(Cors());
app.post('/register', async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    resp.send(result);
});

app.post('/login', async (req, resp) => {
    if (req.body.email && req.body.password) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            resp.send(user);
        } else {
            resp.send("Invalid credentials");
        }

    } else {
        return resp.send("Please provide email and password");
    }
});

app.post('/addProduct', async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result);
});

app.get('/products', async (req, res) => {
    let products = await Product.find();
    if (products.length > 0) {
        res.send(products);
    } else {
        res.send({ result: "No products found" });
    }
});

app.delete('/delproduct/:id', async (req, res) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    res.send(result)
});

app.get('/upproduct/:id', async (req, res) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        res.send(result);
    } else {
        res.send({ result: "No product found" });
    }
});

app.put('/inproduct/:id', async (req, res) => {
    let result = await Product.updateOne({ _id: req.params.id }, { $set: req.body });
    res.send(result);
});

app.get('/search/:key', async (req, res) => {
    let result = await Product.find(
        {
            "$or": [
                { name: { $regex: req.params.key } },
                { price: { $regex: req.params.key } },
                { company: { $regex: req.params.key } },
                { category: { $regex: req.params.key } }
            ]
        }
    )
    res.send(result);
});

app.get('/user/:userId', async (req,res)=>{
    const user = await User.findById(req.params.userId).select("name email");
    if (!user) {
        res.status(404).json({ message: "No user found" });
    } else {
        res.status(200).json(user);
    }
});

app.listen(5000);