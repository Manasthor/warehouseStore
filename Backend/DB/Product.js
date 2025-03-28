import { Schema, model } from 'mongoose';
const productSchema = new Schema({
    name: String,
    price: Number,
    category: String,
    userId: String,
    company: String,
    quantity: Number
})

export default model('products', productSchema);