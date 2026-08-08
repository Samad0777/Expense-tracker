import React from 'react'
import { User } from 'lucide-react';


const Navbar = () => {
  return (
    <nav className='bg-surface py-6 px-4 flex items-center justify-between shadow-lg'>
        <div>
            <h2 className='text-2xl'>Dashboard</h2>
        </div>
        <div>
            <User className='cursor-pointer'/>
        </div>
    </nav>
  )
}

export default Navbar