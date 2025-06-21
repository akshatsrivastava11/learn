'use client'
import { extractPdf } from "@/hooks/extractPdf";
import { useState } from "react";
// import { extractPDFText } from ""; // path may vary

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState("");
  const [progress, setProgress] = useState(0);

  const handleSubmit = async () => {
    if (!file) return;
    const text = await extractPdf(file);
    setPdfText(text);
  };

  return (
    <>
      <h1>PDF OCR</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files[0]) setFile(files[0]);
          }}
        />
        <button type="submit">Submit</button>
      </form>

      <div>
        <progress value={progress} max={1} />
        <pre>{pdfText}</pre>
      </div>
    </>
  );
}
