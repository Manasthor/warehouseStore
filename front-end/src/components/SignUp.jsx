import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {

    const[name,setName]=useState("")
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    useEffect(()=>{
        if(localStorage.getItem('user')){
            navigate('/')
        }
    },[])
    const navigate = useNavigate()
    const con= async()=>{
        let result = await fetch('http://localhost:5000/register',{
            method:'post',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,email,password
            })
        })
        let ans = await result.json()
        localStorage.setItem('user',JSON.stringify(ans))
        if(ans){
            navigate('/')
        }
    }
    
  return (
    <div className='m-30 p-10'>
        <h1>Register</h1>
        <input type="text" placeholder="Enter your name" value={name} onChange={(e)=>{
            setName(e.target.value)
        }} className="border-2 border-blue-300 p-1 m-1 block w-72" />
        <input type="email" placeholder="Enter your email" value={email} onChange={(e)=>{
            setEmail(e.target.value)
        }} className="border-2 border-blue-300 p-1 m-1 block w-72" />
        <input type="password" placeholder="Enter your password" value={password} onChange={(e)=>{
            setPassword(e.target.value)
        }} className="border-2 border-blue-300 p-1 m-1 block w-72" />
        <button onClick={con} className="bg-pink-100 p-1 m-1 border-1 pointer-events-auto">Register</button>
    </div>
  )
}

export default SignUp