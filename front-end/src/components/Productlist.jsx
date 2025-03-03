import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Productlist = () => {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();
    const API_URL = import.meta.env.REACT_APP_API_URL || "https://warehousestore.onrender.com";

    useEffect(() => {
        getProduct();
    }, []);

    const getProduct = async () => {
        setLoading(true); // Set loading before fetch
        try {
            let result = await fetch(`${API_URL}/products`, {
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            let ans = await result.json();
            setProduct(ans);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false); // Set loading after fetch (success or failure)
        }
    };

    const deleteProduct = async (id) => {
        try {
            let result = await fetch(`${API_URL}/delproduct/${id}`, {
                method: 'DELETE',
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });

            if (result.ok) {
                getProduct(); // Re-fetch products after successful delete
            } else {
                alert("Failed to delete product.");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const searchHandle = async (e) => {
        let key = e.target.value.toLowerCase();
        if (key) {
            try {
                let result = await fetch(`${API_URL}/search/${key}`, {
                    headers: {
                        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                    }
                });
                let ans = await result.json();
                setProduct(ans);
            } catch (error) {
                console.error("Error searching product:", error);
            }
        } else {
            getProduct();
        }
    };

    return (
        <div>
            <h1 className="text-center">Product List</h1>
            <div className="flex justify-end items-center p-2">
                <input
                    type="text"
                    placeholder="Search Product"
                    className="border-2 border-blue-300 p-1 m-1 w-96"
                    onChange={searchHandle}
                />
            </div>
            <div className="overflow-y-auto">
                <ul className="flex justify-around items-center p-2 border border-blue-400 bg-blue-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 tracking-wide w-full max-w-full mx-auto sticky top-0 z-10">
                    <li className="px-2 py-2 text-center flex-1 border-r border-gray-300 font-extrabold">S No.</li>
                    <li className="px-2 py-2 text-center flex-1 border-r border-gray-300 font-extrabold">Name</li>
                    <li className="px-2 py-2 text-center flex-1 border-r border-gray-300 font-extrabold">Price</li>
                    <li className="px-2 py-2 text-center flex-1 border-r border-gray-300 font-extrabold">Category</li>
                    <li className="px-2 py-2 text-center flex-1 border-r border-gray-300 font-extrabold">Company</li>
                    <li className="px-2 py-2 text-center flex-1 font-extrabold">Action</li>
                </ul>

                {loading ? (
                    <p className="text-center">Loading products...</p>
                ) : product.length > 0 ? (
                    product.map((item, index) => (
                        <ul
                            key={index}
                            className="flex justify-around items-center p-2 border border-blue-400 bg-blue-100 rounded-xl shadow-sm text-sm font-medium text-gray-700 tracking-wide w-full max-w-full mx-auto my-1"
                        >
                            <li className="px-2 py-2 text-center flex-1 border-r border-gray-300 font-bold">{index + 1}</li>
                            <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">{item.name}</li>
                            <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">${item.price}</li>
                            <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">{item.category}</li>
                            <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">{item.company}</li>
                            <li className="px-2 py-2 text-center flex-1">
                                <button className='hover:cursor-pointer' onClick={() => deleteProduct(item._id)}>Delete</button>
                                <Link to={`/update/${item._id}`}> Update</Link>
                            </li>
                        </ul>
                    ))
                ) : (
                    <h1 className="text-center">No Product Available</h1>
                )}
            </div>
        </div>
    );
};

export default Productlist;