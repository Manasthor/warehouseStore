import { Schema, model } from 'mongoose';
const productSchema = new Schema({
    name: String,
    price: String,
    category: String,
    userId: String,
    company: String
})

export default model('products', productSchema);