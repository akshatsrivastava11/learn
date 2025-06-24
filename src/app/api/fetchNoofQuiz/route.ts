import { fetchnoofquiz } from "../controller.auth";

export async function POST(req: Request) {
    // loginHandler(req)
    // return fetchUserQuiz(req)
    return fetchnoofquiz(req)
}
