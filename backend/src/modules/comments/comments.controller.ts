
// TODO:
import { NextFunction, Request, RequestHandler, Response } from "express";
import { Container } from "typedi";
import { CommentService } from "./comment.service";
import { NotFoundError } from "utils/ApiError";
import AsyncHandler from "utils/AsyncHandler";

export class CommentController {
    private commentService = Container.get(CommentService);

    addComment: RequestHandler = (
        async (req: Request, res: Response, next: NextFunction): Promise<any> => {
            const { postId, content, parentId } = req.body;

            const userId = req.userId;
            if(!userId) throw new NotFoundError("Can not found id")
            const comment = await this.commentService.addComment(userId, postId, content, parentId);
            return res.status(201).json({comment});
        }
    )

    // async addComment(req: Request, res: Response, next: NextFunction) {
    //     const { postId, content, parentId } = req.body;
    //     console.log({ postId, content, parentId });
    //     const userId = req.userId;
    //     const comment = await this.commentService.addComment(userId, postId, content, parentId);
    //     return res.send(`oke route add Comment`)
    // }

    async getComments(req: Request, res: Response, next: NextFunction) {

        const { postId } = req.params;
        return res.send(`oke getComments `)
        // const comments = await this.commentService.getComments(Number(postId));
        // res.status(200).json(comments);
    }

    async updateComment(req: Request, res: Response, next: NextFunction) {

        return res.send(`oke route updateComment `)
        // const { content } = req.body;
        // // const userId = req.user.id;
        // const { commentId } = req.params;
        // const updatedComment = await this.commentService.updateComment(userId, Number(commentId), content);
        // res.status(200).json(updatedComment);

    }

    async deleteComment(req: Request, res: Response, next: NextFunction) {
        return res.send(`oke route deleteComment `)
        // const userId = req.userId
        // const { commentId } = req.params;
        // if (!userId) throw new NotFoundError("Can not found id")
        // await this.commentService.deleteComment(userId, Number(commentId));
        // res.status(204).send();

    }
    async hideComment(req: Request, res: Response, next: NextFunction) {
        return res.send(`oke route hideComment - Route Admin - Mod - hide comments `)
        // const userId = req.userId
        // const { commentId } = req.params;
        // if (!userId) throw new NotFoundError("Can not found id")
        // await this.commentService.deleteComment(userId, Number(commentId));
        // res.status(204).send();

    }
}
