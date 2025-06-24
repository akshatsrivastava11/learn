import { loginHandler } from '../controller.auth'



export async function POST(req: Request) {
    loginHandler(req)
}
