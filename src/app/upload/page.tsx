'use client'
import Background from '@/components/Background'
import Side_bar from '@/components/Side_bar'
import { FileUpload } from '@/components/ui/file-upload'
import { Sidebar } from '@/components/ui/sidebar'
import { extractPdf } from '@/hooks/extractPdf'
import React, { useEffect, useState } from 'react'

function page() {
  const [file,setfile]=useState<File|null>();
  // const extractPdfdatais=extractPdf()
   const handleFile=(file:File)=>{
    setfile(file)
    console.log(file)
    
   }
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Background>
        <Side_bar />
        <div className="flex justify-center items-center w-full h-full">
          <FileUpload childToParent={handleFile}/>
        </div>
      </Background>
    </div>
  )
}

export default page