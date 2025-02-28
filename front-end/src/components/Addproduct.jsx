import React, { useState, useEffect } from 'react'

const Addproduct = () => {

    const[name,setname]=useState("")
    const[price,setprice]=useState("")
    const[category,setcategory]=useState("")
    const[company,setcompany]=useState("")
    const[error,seterror]=useState(false)
    const addproduct = async()=>{
        const userId = JSON.parse(localStorage.getItem('user'))._id;
        if(!userId || !name || !price || !category || !company){
            seterror(true)
            return (false)
        }

        
        let result = await fetch('http://localhost:5000/addProduct',{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                price,
                category,
                userId,
                company
            })
        })
        if(result){
            setname("")
            setprice("")
            setcategory("")
            setcompany("")
        }
    }


    return (
        <div>
            <h1 className='text-center'>Add Product</h1>
            <div className="flex justify-center items-center p-20">
                <div>
                    <input type="text" placeholder="Enter product name" value={name} onChange={(e)=>{setname(e.target.value)}} className="border-2 border-blue-300 p-1 m-1 block w-72" />
                    {error && !name && <span className="text-red-500 p-1">Enter Valid Name</span>}
                    <input type="text" placeholder="Enter product price" value={price} onChange={(e)=>{setprice(e.target.value)}} className="border-2 border-blue-300 p-1 m-1 block w-72" />
                    {error && !price && <span className="text-red-500 p-1">Enter Valid Price</span>}
                    <input type="text" placeholder="Enter product Category" value={category} onChange={(e)=>{setcategory(e.target.value)}} className="border-2 border-blue-300 p-1 m-1 block w-72" />
                    {error && !category && <span className="text-red-500 p-1">Enter Valid Category</span>}
                    <input type="text" placeholder="Enter product Company" value={company} onChange={(e)=>{setcompany(e.target.value)}} className="border-2 border-blue-300 p-1 m-1 block w-72" />
                    {error && !company && <><span className="text-red-500 p-1">Enter Valid Company</span><br /></>}
                    <button onClick={addproduct} className="bg-pink-100 p-1 m-1 border-1 pointer-events-auto">Add Product</button>
                </div>
            </div>
        </div>
    )
}

export default Addproduct;
