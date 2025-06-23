// controller.auth.ts

import { PrismaClient } from '@/database/generated/prisma'

const prisma = new PrismaClient()

export const registerHandler = async (req: Request) => {
  try {
    const { email } = await req.json()

    const existingUser = await prisma.user.findUnique({where:{email:email}})
      if (existingUser) {
      // 👇 Forward to login handler directly
      return loginHandler(new Request(req.url, {
        method: 'POST',
        body: JSON.stringify({ email}),
        headers: { 'Content-Type': 'application/json' }
      }))
    }

    // const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({ data: { email} })

    return Response.json({ message: 'User created successfully' }, { status: 201 })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export const loginHandler = async (req: Request) => {
  try {
    const { email} = await req.json()

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return Response.json({ error: 'No user found' }, { status: 404 })
    }

    // const isPasswordCorrect = await bcrypt.compare(password, user.password)
    // if (!isPasswordCorrect) {
    //   return Response.json({ error: 'Incorrect password' }, { status: 401 })
    // }

    return Response.json({ message: 'Login successful' }, { status: 200 })
  } catch (error) {
    console.error('Login error:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
