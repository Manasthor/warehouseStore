import React from 'react'

const Footer = () => {
    return (
        <div className='text-center p-3 mt-5 bg-blue-200 w-full absolute bottom-0'>
            <h3>E-Comm Dashboard</h3>
            <p>&copy; {new Date().getFullYear()} WareHouse Store. All rights reserved.</p>
        </div>
    )
}

export default Footer 