import { fetchquizquesn } from "../controller.auth";

export async function POST(req: Request) {
    // loginHandler(req)
    // return fetchUserQuiz(req)
    return fetchquizquesn(req)
}
