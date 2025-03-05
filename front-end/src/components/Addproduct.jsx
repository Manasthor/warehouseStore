import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Addproduct = () => {
    const [name, setname] = useState("");
    const [price, setprice] = useState("");
    const [category, setcategory] = useState("");
    const [company, setcompany] = useState("");
    const [error, seterror] = useState(false);
    const navigate = useNavigate();

    // Use environment variable or fallback to Render API
    const API_URL = import.meta.env.REACT_APP_API_URL || "https://warehousestore.onrender.com";

    const addproduct = async () => {
        const user = localStorage.getItem('user');
        if (!user) {
            alert("User not logged in.");
            return;
        }

        const userId = JSON.parse(user)._id;

        // Validate inputs
        if (!userId || !name || !price || !category || !company) {
            seterror(true);
            return;
        }

        try {
            let response = await fetch(`${API_URL}/addProduct`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    authorization: `bearer ${JSON.parse(sessionStorage.getItem('token'))}`
                },
                body: JSON.stringify({
                    name,
                    price,
                    category,
                    userId,
                    company
                })
            });

            let result = await response.json();

            if (response.ok) {
                setname("");
                setprice("");
                setcategory("");
                setcompany("");
                navigate('/');
            } else {
                console.log(result.error || "Failed to add product.");
            }
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Server error. Try again later.");
        }
    };

    return (
        <div>
            <h1 className='text-center'>Add Product</h1>
            <div className="flex justify-center items-center p-20">
                <div>
                    <input type="text" placeholder="Enter product name" value={name} onChange={(e) => setname(e.target.value)} className="border-2 border-blue-300 p-1 m-1 block w-72" />
                    {error && !name && <span className="text-red-500 p-1">Enter Valid Name</span>}

                    <input type="text" placeholder="Enter product price" value={price} onChange={(e) => setprice(e.target.value)} className="border-2 border-blue-300 p-1 m-1 block w-72" />
                    {error && !price && <span className="text-red-500 p-1">Enter Valid Price</span>}

                    <input type="text" placeholder="Enter product Category" value={category} onChange={(e) => setcategory(e.target.value)} className="border-2 border-blue-300 p-1 m-1 block w-72" />
                    {error && !category && <span className="text-red-500 p-1">Enter Valid Category</span>}

                    <input type="text" placeholder="Enter product Company" value={company} onChange={(e) => setcompany(e.target.value)} className="border-2 border-blue-300 p-1 m-1 block w-72" />
                    {error && !company && <span className="text-red-500 p-1">Enter Valid Company</span>}

                    <button onClick={addproduct} className="bg-pink-100 p-1 m-1 border-1 pointer-events-auto">Add Product</button>
                </div>
            </div>
        </div>
    );
};

export default Addproduct;
