import Background from '@/components/Background'
import LoginPage from '@/components/LoginPage'
import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
function page() {
  return (
    <Background>
    <LoginPage/>
 

    </Background>
 
)
}

export default page