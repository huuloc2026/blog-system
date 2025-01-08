

import { Container, Service } from "typedi";
import { UserRepository } from "modules/Users/user.repository";
import { CommentRepository } from "./comments.repository";
import { PostRepository } from "modules/Post/post.repository";
import { ConflictError, NotFoundError } from "utils/ApiError";

@Service()
export class CommentService {
    constructor(
        private commentRepository: CommentRepository,
        private userRepository: UserRepository,
        private postRepository: PostRepository,
    ) {
        this.commentRepository = Container.get(CommentRepository)
        this.userRepository = Container.get(UserRepository)
        this.postRepository = Container.get(PostRepository)
    }

    async addComment(userId: number, postId: number, content: string, parentId?: number) {

        const user = await this.userRepository.findById(userId);
        const post = await this.postRepository.findById(postId);
        if (!post) throw new NotFoundError("Post not found");
        if (!user) throw new NotFoundError("User not found");
        

        //check user just 1 comment 
        if(!parentId){
            const hasCommented = await this.commentRepository.hasCommentedOnPost(userId, postId);
            if (hasCommented) throw new ConflictError("User can only comment once per post");
        }

        //check parent id <-> id of comment
        //TODO: check this
        return this.commentRepository.createComment({
            content,
            user,
            post: post,
            parentComment: parentId
        });
    }


    // async getComments(postId: number) {
    //     return this.commentRepository.getCommentsByPost(postId);
    // }

    async updateComment(userId: number, commentId: number, content: string) {
        // const comment = await this.commentRepository.findById(commentId);
        // if (comment.user.id !== userId) {
        //     throw new Error("You can only update your own comments");
        // }
        // return this.commentRepository.updateComment(commentId, content);
    }

    async deleteComment(userId: number, commentId: number) {
        // const comment = await this.commentRepository.findById(commentId);
        // if (comment.user.id !== userId) {
        //     throw new Error("You can only delete your own comments");
        // }
        // await this.commentRepository.deleteComment(commentId);
    }

    async hideComment(adminId: number, commentId: number) {
        // Check if adminId is admin/mod
        return this.commentRepository.hideComment(commentId);
    }
}
