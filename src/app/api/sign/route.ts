import { PrismaClient } from '@prisma/client'

import { registerHandler } from '../controller.auth'


export async function POST(req: Request) {
    console.log("route triggered")
    return registerHandler(req)
}
