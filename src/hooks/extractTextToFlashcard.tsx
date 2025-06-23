// import { saveQuesnsToDb } from "./saveQuesnToDb";

export const extractTextToFlashCards = async (text: string,user:any) => {
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
    
   const sendToDb=await fetch("/api/save-flashcards",{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        useremail:user.emailAddresses[0].emailAddress,
        flashs:questions
      }),
    })
    console.log("the res is ",sendToDb);
  };
  