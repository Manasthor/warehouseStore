import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Edit = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantityChange, setQuantityChange] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const API_URL = import.meta.env.VITE_API_URL || "https://warehousestore.onrender.com";

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`${API_URL}/products/${id}`);
            if (!response.ok) throw new Error("Product not found");
            const data = await response.json();
            setProduct(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (amount) => {
        if (!product) return;

        const newQuantity = product.quantity + amount;
        if (newQuantity < 0) return alert("Quantity cannot be negative");

        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...product, quantity: newQuantity })
            });
            if (!response.ok) throw new Error("Failed to update quantity");
            setProduct({ ...product, quantity: newQuantity });
            setQuantityChange('');
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <h1 className="text-center">Loading product details...</h1>;
    if (error) return <h1 className="text-center text-red-500">{error}</h1>;

    return (
        <div className="p-4">
            <h1 className="text-center text-2xl font-bold">Update Quantity</h1>
            {product && (
                <div className="text-center p-4">
                    <h2 className="text-xl font-semibold">{product.name}</h2>
                    <p>Price: ₹{product.price}</p>
                    <p>Category: {product.category}</p>
                    <p>Company: {product.company}</p>
                    <p>Quantity: {product.quantity}</p>
                    <input 
                        type="number" 
                        value={quantityChange} 
                        onChange={(e) => {
                            const value = e.target.value.replace(/^0+(\d+)/, '$1');
                            setQuantityChange(value);
                        }} 
                        className="border p-2 mt-2 w-30 text-center"
                        placeholder="Enter qty"
                    />
                    <div className="flex justify-center gap-4 mt-4">
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => updateQuantity(parseInt(quantityChange) || 0)}>Add</button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => updateQuantity(-(parseInt(quantityChange) || 0))}>Sold</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Edit;