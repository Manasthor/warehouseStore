import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Productlist = () => {

    const [product, setproduct] = useState([])

    useEffect(() => {
        getproduct()
    }, [])

    const getproduct = async () => {
        let result = await fetch('http://localhost:5000/products')
        let ans = await result.json()
        setproduct(ans)
    }

    const deleteProduct = async (id) => {
        let result = await fetch(`http://localhost:5000/delproduct/${id}`, {
            method: 'DELETE'
        })
        if (result) {
            getproduct()
        }
    }

    const searchHandle = async(e) => {
        let key = e.target.value
        if(key){
            let result = await fetch(`http://localhost:5000/search/${key}`)
            let ans = await result.json()
            if(ans){
                setproduct(ans)
            }
        }else{
            getproduct()
        }
    }

    return (
        <div>
            <h1 className='text-center'>Product List</h1>
            <div className='flex justify-end items-center p-2'>
                <input type="text" placeholder="Search Product" className="border-2 border-blue-300 p-1 m-1 w-96" 
                onChange={searchHandle}/>
            </div>
            <ul className="flex justify-around items-center p-2 border border-blue-400 bg-blue-100 rounded-xl shadow-sm text-sm font-medium text-gray-700 tracking-wide w-full max-w-full mx-auto">
                <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">S No.</li>
                <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">Name</li>
                <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">Price</li>
                <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">Category</li>
                <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">Company</li>
                <li className="px-2 py-2 text-center flex-1">Action</li>
            </ul>
            {product.length > 0 ? product.map((item, index) => (
                <ul key={index} className="flex justify-around items-center p-2 border border-blue-400 bg-blue-100 rounded-xl shadow-sm text-sm font-medium text-gray-700 tracking-wide w-full max-w-full mx-auto my-1">
                    <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">{index + 1}</li>
                    <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">{item.name}</li>
                    <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">${item.price}</li>
                    <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">{item.category}</li>
                    <li className="px-2 py-2 text-center flex-1 border-r border-gray-300">{item.company}</li>
                    <li className="px-2 py-2 text-center flex-1">
                        <button onClick={() => deleteProduct(item._id)}>Delete  </button>
                        <Link to={"/update/" + item._id}>  Update</Link>
                    </li>
                </ul>
            )) : <h1 className='text-center'>No Product Available</h1>
        }
        </div>
    )
}

export default Productlist