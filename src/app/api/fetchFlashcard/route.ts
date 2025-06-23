import { fetchFlashcard } from "../controller.auth";

export async function POST(req: Request) {
    // loginHandler(req)
    // return fetchUserQuiz(req)
    return fetchFlashcard(req)
}
