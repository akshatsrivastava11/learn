import { save_FlashcardsHandler } from "../controller.auth"

export async function POST(req: Request) {
  
    console.log("the  save quiz route triggered")
   return save_FlashcardsHandler(req)
}
