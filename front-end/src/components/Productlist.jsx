import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Productlist = () => {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || "https://warehousestore.onrender.com";
    const token = JSON.parse(localStorage.getItem('token'));

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            getProduct();
        }
    }, []);

    const getProduct = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/products`, {
                headers: { authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                throw new Error("Failed to fetch products");
            }

            const data = await response.json();
            setProduct(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${API_URL}/delproduct/${id}`, {
                method: 'DELETE',
                headers: { authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Failed to delete product");
            }

            setProduct(product.filter((item) => item._id !== id));
        } catch (error) {
            setError(error.message);
        }
    };

    const searchHandle = async (e) => {
        const key = e.target.value.trim().toLowerCase();
        if (!key) return getProduct();

        try {
            const response = await fetch(`${API_URL}/search/${key}`, {
                headers: { authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Search failed");
            }

            const data = await response.json();
            setProduct(data);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h1 className="text-center text-2xl font-bold">Product List</h1>
            <div className="flex justify-end items-center p-2">
                <input
                    type="text"
                    placeholder="Search Product"
                    className="border-2 border-blue-300 p-2 m-1 w-96 rounded-md"
                    onChange={searchHandle}
                />
            </div>

            {loading ? (
                <p className="text-center text-lg font-semibold text-gray-600">Loading products...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : product.length > 0 ? (
                <div className="overflow-y-auto">
                    <ul className="flex justify-around items-center p-2 border border-blue-400 bg-blue-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 tracking-wide w-full max-w-full mx-auto sticky top-0 z-10">
                        <li className="px-2 py-2 text-center flex-1 border-r border-gray-300 font-extrabold">S No.</li>
                        <li className="px-2 py-2 text-center flex-1 border-r border-gray-300 font-extrabold">Name</li>
                        <li className="px-2 py-2 text-center flex-1 border-r border-gray-300 font-extrabold">Price</li>
                        <li className="px-2 py-2 text-center flex-1 border-r border-gray-300 font-extrabold">Category</li>
                        <li className="px-2 py-2 text-center flex-1 border-r border-gray-300 font-extrabold">Company</li>
                        <li className="px-2 py-2 text-center flex-1 font-extrabold">Action</li>
                    </ul>

                    {product.map((item, index) => (
                        <ul
                            key={item._id}
                            className="flex justify-around items-center p-2 border border-blue-400 bg-blue-100 rounded-xl shadow-sm text-sm font-medium text-gray-700 tracking-wide w-full max-w-full mx-auto my-1"
                        >
                            <li className="px-2 py-2 text-center flex-1 border-r border-gray-300 font-bold">{index + 1}</li>
                            <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">{item.name}</li>
                            <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">${item.price}</li>
                            <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">{item.category}</li>
                            <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">{item.company}</li>
                            <li className="px-2 py-2 text-center flex-1">
                                <button
                                    className="hover:cursor-pointer text-red-500"
                                    onClick={() => deleteProduct(item._id)}
                                >
                                    Delete
                                </button>
                                <Link to={`/update/${item._id}`} className="ml-2 text-blue-500">
                                    Update
                                </Link>
                            </li>
                        </ul>
                    ))}
                </div>
            ) : (
                <h1 className="text-center text-lg font-semibold text-gray-600">No Products Available</h1>
            )}
        </div>
    );
};

export default Productlist;
