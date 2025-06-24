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

export const save_quizHandler=async (req:Request)=>{
  try {
     const {useremail,quesn,QuizName}=await req.json();
     console.log("user email is ",useremail)
     console.log("lenght of ques in handler is ",quesn.length)
      const userId=await prisma.user.findUnique({where:{email:useremail}})
      console.log(userId)
    if(userId==null) return
    const quesSlice=quesn.slice(0,10)
   const quiz=await prisma.quiz.create({
    data:{
        userId:userId.id,
        QuizQuesn:{
            create:quesSlice
        },
        QuizName:QuizName
    },
    include:{
        QuizQuesn:true
    }
   })  
  } catch (error) {
    console.log("Quiz creation error",error)
  }
   return Response.json({message:"Quiz created successfully"},{status:200})
}

export const save_FlashcardsHandler=async (req:Request)=>{
  try {
    const {useremail,flashs}=await req.json()
    console.log("User email is ",useremail);
    console.log("Flashes are",flashs);
    const userId=await prisma.user.findUnique({where:{email:useremail}});
    console.log(userId);
    if(userId==null) return
    type returnForF={
      Quesn:string,
      Ans:string,
      userId:string
    }
    const flashe=flashs.slice(0,5)
    const flashes=await prisma.flashcard.createMany({
      data:flashe.map((f: { Quesn: string; Ans: string })=>({
        Quesn:f.Quesn,
        Ans:f.Ans,
        userId:userId.id
      })),
    })
    console.log("Flashcards added successfully",flashes);
   return Response.json({message:"Quiz created successfully"},{status:200})
  } catch (error) {
    console.log("An error occured",error);
  }

}

export const fetchUserQuiz=async (req:Request)=>{
  
  try {
    const {useremail}=await req.json()
    console.log("users email is",useremail);
    const user=await prisma.user.findFirst({where:{email:useremail}})
    if(!user) return ; 
     let quizzes = await prisma.quiz.findMany({
      where: {
        userId: user.id,
      },
      include: {
        QuizQuesn: true, // Include the related questions (Quesn_Atoms)
      },
      orderBy: {
        createdAt: 'desc',
      },
    }); 
    // return Response.json({message:quizzes});
    return Response.json({message:quizzes},{status:200})
  
  } catch (error) {
    console.log("An error occured",error);
    
  }
}
export const fetchquizquesn=async (req:Request)=>{
  try {
    const {quizId}=await req.json();
    console.log("The quiz id is",quizId)
    let quesn=await prisma.quesn_Atoms.findMany({
      where:{
        quizId:quizId
      }
    })
    console.log("the quesn is",quesn);
    
    return Response.json({message:quesn});
  } catch (error) {
    console.log("An error occured",error);
  }
}

export const fetchFlashcard=async (req:Request)=>{
  try {
    const {useremail}=await req.json()
    console.log("The user email is ",useremail);
    const user=await prisma.user.findFirst({where:{email:useremail}})
    if(!user) return 
    const flashcards=await prisma.flashcard.findMany({
      where:{
        userId:user.id
      }
    })
    console.log("the flashcards are",flashcards)
    return Response.json({message:flashcards})
  } catch (error) {
    console.log("An error occured",error);
  }
}
