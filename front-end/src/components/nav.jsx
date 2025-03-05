import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from '../images/Logo.svg'

const Nav = () => {
    const auth = localStorage.getItem('user')
    const navigate = useNavigate()
    const logout = () => {
        localStorage.clear()
        navigate('/Login')
    }
    return (
        <div className="navbar bg-blue-200 p-4 flex justify-between items-center">
            <img src={Logo} alt="logo" className="w-20 h-20" />
            { auth ? <ul className="flex gap-10 m-4">
                <li className="text-white p-1"><Link to="/">Product</Link></li>
                <li className="text-white p-1"><Link to="/AddProduct">Add Product</Link></li>
                {/*<li className="text-white p-1"><Link to="/update product">Update Product</Link></li>*/}
                <li className="text-white p-1"><Link to="/profile">Profile</Link></li>
                <li className="text-white p-1"><Link to="/logout" onClick={logout}>Logout ({JSON.parse(auth).name})</Link></li>
            </ul>:
            <ul className="flex gap-10">
                <li className="text-white p-1"><Link to="/signup">Signup</Link></li>
                <li className="text-white p-1"><Link to="/Login">Login</Link></li>
            </ul>
            }
        </div>
    )
}

export default Nav;