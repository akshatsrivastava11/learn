import { PrismaClient } from "@prisma/client"
import { save_FlashcardsHandler } from "../controller.auth"
const prismaClient = new PrismaClient()

export async function POST(req: Request) {
  
    console.log("the  save quiz route triggered")
   return save_FlashcardsHandler(req)
}
