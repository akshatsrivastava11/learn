import Background from '@/components/Background'
import Side_bar from '@/components/Side_bar'
import { FileUpload } from '@/components/ui/file-upload'
import { Sidebar } from '@/components/ui/sidebar'
import React from 'react'

function page() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Background>
        <Side_bar />
        <div className="flex justify-center items-center w-full h-full">
          <FileUpload/>
        </div>
      </Background>
    </div>
  )
}

export default page