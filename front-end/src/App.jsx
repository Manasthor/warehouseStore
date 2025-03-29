import { useState } from 'react'
import './App.css'
import Nav from './components/nav'
import { Routes, Route } from 'react-router-dom'
import Footer from './components/footer'
import SignUp from './components/SignUp'
import PrivateRoutes from './components/PrivateRoutes'
import Login from './components/Login'
import Addproduct from './components/Addproduct'
import Productlist from './components/Productlist'
import Updateproduct from './components/Updateproduct'
import Profile from './components/profile'
import Edit from './components/Edit'

function App() {
  return (
    <>
      <Nav />
      <Routes>

        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Productlist />} />
          <Route path="/Addproduct" element={<Addproduct />} />
          <Route path="/update/:id" element={<Updateproduct />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/logout" element={<h1>Logout</h1>} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/signup" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
