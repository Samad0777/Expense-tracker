import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className='min-h-screen flex'>
       <Sidebar/>
       <div className='flex-1'>
        <Navbar/>
        <main>
        <Outlet/>
        </main>
       </div>
    </div>
  )
}

export default MainLayout