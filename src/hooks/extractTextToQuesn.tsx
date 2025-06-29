// import { saveQuesnsToDb } from "./saveQuesnToDb";

export const extractTextToQues = async (text: string, user: unknown, quizName?: string) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
    const questions = [];
  
    let currentQuestion: {
      question: string;
      options: string[];
      answer: string;
    } | null = null;
  
    for (const line of lines) {
      if (line.startsWith('Q.')) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          question: line.replace('Q.', '').trim(),
          options: [],
          answer: ''
        };
        // console.log("Line is ",line);
        // console.log("Current quesn is ",currentQuestion)
      } else if (line.startsWith('A.')) {
        currentQuestion?.options.push(line.replace('A.', '').trim());
      } else if (line.startsWith('ANS.')) {
        currentQuestion!.answer = line.replace('ANS.', '').trim();
      }
    }
    
    console.log("Quesn is ",questions);
    // Push the final question
    if (currentQuestion) {
      questions.push(currentQuestion);
    }

     const formattedQuestions = questions.map((q) => ({
    Quesn: q.question,
    Answer: q.answer,
    Option1: q.options[0] || '',
    Option2: q.options[1] || '',
    Option3: q.options[2] || '',
  }));
  console.log("Formatted quesn is ",formattedQuestions.length)
    // await saveQuesnsToDb(formattedQuestions,user)
    const email = typeof user === 'object' && user !== null && 'emailAddresses' in user && Array.isArray((user as any).emailAddresses) && (user as any).emailAddresses[0]?.emailAddress;
    const sendToDb=await fetch("/api/save-quiz",{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        useremail: email,
        quesn: formattedQuestions,
        QuizName: quizName || "Untitled Quiz"
      }),

    })
    console.log("the res is ",sendToDb);
    return questions;
  };
  