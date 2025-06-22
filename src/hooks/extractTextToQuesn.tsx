export const extractTextToQues = async (text: string) => {
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
      console.log("Quesn is ",questions);
      // Push the final question
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
    }
  
    return questions;
  };
  