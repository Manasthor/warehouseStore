import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const Updateproduct = () => {

    const[name,setname]=useState("")
    const[price,setprice]=useState("")
    const[category,setcategory]=useState("")
    const[company,setcompany]=useState("")
    const navigate = useNavigate()
    const param = useParams()

    useEffect(()=>{
        getProductId()
    },[])

    const getProductId = async()=>{
        let result = await fetch(`http://localhost:5000/upproduct/${param.id}`)
        result = await result.json()
        setname(result.name)
        setprice(result.price)
        setcategory(result.category)
        setcompany(result.company)
    }

    const updateproduct = async()=>{
        let result = await fetch(`http://localhost:5000/inproduct/${param.id}`,{
            method:'PUT',
            body:JSON.stringify({name,price,category,company}),
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'
            }
        })
        result = await result.json()
        navigate('/')
    }


    return (
        <div>
            <h1 className='text-center'>Update Product</h1>
            <div className="flex justify-center items-center p-20">
                <div>
                    <input type="text" placeholder="Enter product name" value={name} onChange={(e)=>{setname(e.target.value)}} className="border-2 border-blue-300 p-1 m-1 block w-72" />
                    <input type="text" placeholder="Enter product price" value={price} onChange={(e)=>{setprice(e.target.value)}} className="border-2 border-blue-300 p-1 m-1 block w-72" />
                    <input type="text" placeholder="Enter product Category" value={category} onChange={(e)=>{setcategory(e.target.value)}} className="border-2 border-blue-300 p-1 m-1 block w-72" />
                    <input type="text" placeholder="Enter product Company" value={company} onChange={(e)=>{setcompany(e.target.value)}} className="border-2 border-blue-300 p-1 m-1 block w-72" />
                    <button onClick={updateproduct} className="bg-pink-100 p-1 m-1 border-1 pointer-events-auto">Update Product</button>
                </div>
            </div>
        </div>
    )
}

export default Updateproduct;
