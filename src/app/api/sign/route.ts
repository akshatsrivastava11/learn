import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'
import { registerHandler } from '../controller.auth'

const prisma = new PrismaClient()

export async function POST(req: Request) {
    console.log("route triggered")
    return registerHandler(req)
}
