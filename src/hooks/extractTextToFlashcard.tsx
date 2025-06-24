// import { saveQuesnsToDb } from "./saveQuesnToDb";

export const extractTextToFlashCards = async (text: string, user: unknown) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
    const questions = [];
  
    let currentQuestion: {
      Quesn: string;
      Ans: string;
    } | null = null;
  
    for (const line of lines) {
      if (line.startsWith('Q.')) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          Quesn: line.replace('Q.', '').trim(),
          Ans: ''
        };
        // console.log("Line is ",line);
        // console.log("Current quesn is ",currentQuestion)
      } else if (line.startsWith('Ans.')) {
        currentQuestion!.Ans = line.replace('Ans.', '').trim();
      }
    }
    
    // Push the final question
    if (currentQuestion) {
        questions.push(currentQuestion);
    }
    console.log("Quesn is ",questions);
    
    const email = typeof user === 'object' && user !== null && 'emailAddresses' in user && Array.isArray((user as any).emailAddresses) && (user as any).emailAddresses[0]?.emailAddress;
   const sendToDb=await fetch("/api/save-flashcards",{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        useremail: email,
        flashs:questions
      }),
    })
    console.log("the res is ",sendToDb);
  };
  