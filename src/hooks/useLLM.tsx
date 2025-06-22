import axios from 'axios'
import { headers } from 'next/headers'
const Together_api_key="156d88350d5bef6d35c983189f32dbd5e426fa6263efeb7ad22025922ee1306d"
const meta_llama_endpoint="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"
const together_api="https://api.together.xyz/v1/chat/completions"
// JSON.stringify
export const useLLM=async(message:string)=>{
    const metadataforQuiz=`
    Generate the quiz based on the below given text with 10 quesn in it 
    with no other text (I repeat No other text) except each question starting with Q. and each ans starting with A. with the
    correct option being starting with ANS. like 
    "Prompt for text"
    Q.question 1 is 
    A.ans 1 
    A.ans 2  
    A.ans 3  
    ANS.ans 4    
    The Prompt for the given text will be 

    ${message}
    `
    const response=await axios.post(
        together_api,
        JSON.stringify({
            model:meta_llama_endpoint,
            prompt:metadataforQuiz,
               max_tokens: 4000,
                    temperature: 0.7,
                    top_p: 0.9,
                    frequency_penalty: 0.1,
                    presence_penalty: 0.1,
                    stop: ["}"],
        })
        ,{
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${Together_api_key}`
            }

        }
    )
    console.log(response.data);
    return response.data.choices?.[0]?.message.content
}
