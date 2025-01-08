


import { Router } from "express";
import AsyncHandler from "utils/AsyncHandler";
import { CommentController } from "./comments.controller";
import { ROLE } from "CONSTANT/role.enum";
import { authorizationMiddleware } from "middlewares/authoraztionmiddleware";
import { authenticateAccessToken } from "middlewares/authenticateAccessToken";
import { asyncHandlerV2 } from "middlewares/async.catch";

const CommentRouter = Router();
const commentController = new CommentController();

CommentRouter.use(authenticateAccessToken)

CommentRouter.post("/createnewcomments", asyncHandlerV2(commentController.addComment))

CommentRouter.get("/getComments", AsyncHandler(commentController.getComments))

CommentRouter.put("/updateComment", AsyncHandler(commentController.updateComment))

CommentRouter.delete("/deleteComment", AsyncHandler(commentController.deleteComment))

CommentRouter.use(authorizationMiddleware([ROLE.ADMIN,ROLE.MOD]))
// Route Admin - Mod - hide comments
CommentRouter.post("/hideComment", AsyncHandler(commentController.hideComment))





export default CommentRouter;
