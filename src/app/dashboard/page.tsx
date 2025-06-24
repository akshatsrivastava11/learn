import SplashCursor from '@/blocks/Animations/SplashCursor/SplashCursor'
import GooeyNav from '@/blocks/Components/GooeyNav/GooeyNav'
import Background from '@/components/Background'
import Dashboard from '@/components/Dashboard'
import Side_bar from '@/components/Side_bar'
import React from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
function page() {
  const items = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    // { label: "Profile", href: "/profile" },
    // { label: "Settings", href: "/settings" },
    // {label:"Logout",href:"/logout"},
    // {label:"Quizes",href:"/quiz"},
    
];


  return (
    <div className="relative w-full h-screen  bg-black text-white">
      <Background>
        {/* <SplashCursor/> */}
        <GooeyNav
          items={items}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          initialActiveIndex={0}
          animationTime={600}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />
        <Side_bar />
        <div className="flex justify-center items-center w-full h-full pointer-events-auto">
          <Dashboard/>
        </div>
      </Background>
    </div>
  )
}

export default page