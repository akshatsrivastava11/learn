import axios from 'axios'
import { headers } from 'next/headers'
const Together_api_key="156d88350d5bef6d35c983189f32dbd5e426fa6263efeb7ad22025922ee1306d"
const meta_llama_endpoint="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"
const together_api="https://api.together.xyz/v1/chat/completions"
// JSON.stringify
export const useLLM=async(message:string)=>{
    const response=await axios.post(
        together_api,
        JSON.stringify({
            model:meta_llama_endpoint,
            prompt:message,
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
