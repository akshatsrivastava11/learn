// onst prisma = new PrismaClient()

import { fetchUserQuiz } from "../controller.auth";

export async function POST(req: Request) {
    // loginHandler(req)
    return fetchUserQuiz(req)
}
