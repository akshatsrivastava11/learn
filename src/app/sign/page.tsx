import Background from '@/components/Background'
import SignupPage from '@/components/Signup'
import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'

function page() {
  return (
    // <div>page</div>
    <Background>

    <SignupPage/>

    </Background>
  )
}

export default page