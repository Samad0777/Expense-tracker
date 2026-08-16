import React, { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const toggleHandler = ()=>{
      setIsSidebarOpen(!isSidebarOpen);
    }
  return (
    <div className='relative z-0 flex h-screen overflow-hidden'>
       <Sidebar isOpen={isSidebarOpen} onMenuClick={toggleHandler}/>
       <div className='flex-1 min-w-0 flex flex-col'>
        <Navbar onMenuClick={toggleHandler}/>
        <main className='flex-1 overflow-y-auto'>
        <Outlet/>
        </main>
       </div>
    </div>
  )
}

export default MainLayout