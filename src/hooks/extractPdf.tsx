'use client'
import Tesseract from "tesseract.js"
// import {pdfjs} from 'react-pdf';
// import {GlobalWorkerOptions,getDocument} from 'pdfjs-dist'
import * as pdfis from 'pdfjs-dist'

// import worker from 'pdfjs-dist/webpack'

// import { useState } from "react";
  pdfis.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

export const extractPdf = async (
  file: File, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (file.type !== 'application/pdf') {
    throw new Error('File must be a PDF');
  }

  const pdf = await pdfis.getDocument(URL.createObjectURL(file)).promise;
  console.log(pdf);
  
  let allText = '';
  const totalPages = pdf.numPages;

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) break;
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({ canvasContext: context, viewport }).promise;
    
    const text = await Tesseract.recognize(
      canvas,
      'eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const pageProgress = (pageNum - 1) / totalPages;
            const currentProgress = m.progress / totalPages;
            const totalProgress = pageProgress + currentProgress;
            onProgress?.(totalProgress);
          }
        }
      }
    ).then(({ data: { text } }) => text);
    
    allText += text + '\n\n';
  }

  return allText;
};
