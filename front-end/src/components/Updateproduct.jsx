import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Updateproduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [company, setCompany] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch API Base URL from environment variables
    const API_BASE_URL = import.meta.env.REACT_APP_API_URL || "https://warehousestore.onrender.com";

    useEffect(() => {
        getProductById();
    }, []);

    const getProductById = async () => {
        try {
            let response = await fetch(`${API_BASE_URL}/upproduct/${id}`);
            if (!response.ok) throw new Error('Product not found');
            
            let result = await response.json();
            setName(result.name);
            setPrice(result.price);
            setCategory(result.category);
            setCompany(result.company);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async () => {
        if (!name || !price || !category || !company) {
            alert('All fields are required!');
            return;
        }

        try {
            let response = await fetch(`${API_BASE_URL}/inproduct/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ name, price, category, company }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            alert('Product updated successfully!');
            navigate('/');
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product. Try again.');
        }
    };

    if (loading) return <h1 className="text-center">Loading product details...</h1>;
    if (error) return <h1 className="text-center text-red-500">{error}</h1>;

    return (
        <div>
            <h1 className="text-center">Update Product</h1>
            <div className="flex justify-center items-center p-20">
                <div>
                    <input type="text" placeholder="Enter product name" value={name} onChange={(e) => setName(e.target.value)} className="border-2 border-blue-300 p-1 m-1 block w-72" />
                    <input type="text" placeholder="Enter product price" value={price} onChange={(e) => setPrice(e.target.value)} className="border-2 border-blue-300 p-1 m-1 block w-72" />
                    <input type="text" placeholder="Enter product Category" value={category} onChange={(e) => setCategory(e.target.value)} className="border-2 border-blue-300 p-1 m-1 block w-72" />
                    <input type="text" placeholder="Enter product Company" value={company} onChange={(e) => setCompany(e.target.value)} className="border-2 border-blue-300 p-1 m-1 block w-72" />
                    <button onClick={updateProduct} className="bg-pink-500 text-white p-2 m-1 border-1 rounded">
                        Update Product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Updateproduct;
