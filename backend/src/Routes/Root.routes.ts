import express from "express"
import UserRouter from "../modules/Users/user.routes"
import AuthRouter from "../modules/Auth/auth.routes"
import PostRouter from "modules/Post/post.routes"
import CommentRouter from "modules/comments/comments.routes"
const router = express()

router.use('/user', UserRouter)
router.use('/auth',AuthRouter)
router.use('/posts',PostRouter)
router.use('/comments', CommentRouter)
export default router