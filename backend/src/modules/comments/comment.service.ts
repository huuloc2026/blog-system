

import { Container, Service } from "typedi";
import { UserRepository } from "modules/Users/user.repository";
import { CommentRepository } from "./comments.repository";
import { PostRepository } from "modules/Post/post.repository";
import { ConflictError, ForbiddenError, NotFoundError, ResourceUnavailableError } from "utils/ApiError";
import { PostService } from "modules/Post/post.service";

@Service()
export class CommentService {
    constructor(
        private commentRepository: CommentRepository,
        private userRepository: UserRepository,
        private postRepository: PostRepository,
        private postService: PostService
    ) {
        this.commentRepository = Container.get(CommentRepository)
        this.userRepository = Container.get(UserRepository)
        this.postRepository = Container.get(PostRepository)
        this.postService = Container.get(PostService)
    }

    async addComment(userId: number, postId: number, content: string, parentId?: string) {


        const user = await this.userRepository.findById(userId);
        //check post published
        const post = await this.postService.checkNewsPublished(postId);
        if (!post) throw new NotFoundError("Post not found");
        if (!user) throw new NotFoundError("User not found");


        //check user just 1 comment 
        if (!parentId) {
            const hasCommented = await this.commentRepository.hasCommentedOnPost(userId, postId);
            if (hasCommented) throw new ConflictError("User can only comment once per post");
        }
        let parentComment = undefined;
        if (parentId) {
            parentComment = await this.commentRepository.findCommentWithRelations(parentId, "post");
            if (!parentComment) throw new NotFoundError("Parent comment not found");
            if (parentComment.post.id !== postId) {
                throw new ConflictError("Parent comment does not belong to this post");
            }
        }
        //check parent id <-> id of comment
        return this.commentRepository.createComment({
            content,
            user: user,
            post: post,
            parentComment: parentComment
        });
    }


    // async getComments(postId: number) {
    //     return this.commentRepository.getCommentsByPost(postId);
    // }

    async updateComment(userId: number, commentId: string, content: string) {
        const comment = await this.commentRepository.findCommentWithRelations(commentId, "user")

        // check exist commenet
        if (!comment) throw new ForbiddenError("Comment not found");
        // check if comment hided by Admin/Mod
        if (!comment.isVisible) {
            throw new ResourceUnavailableError("Your comment hided")
        }
        // Check right update comment
        if (comment.user.userId !== userId) {
            throw new ConflictError("You can only update your own comments");
        }
        return this.commentRepository.updateComment(commentId, content);
    }

    async deleteComment(userId: number, commentId: string) {
        const comment = await this.commentRepository.findCommentWithRelations(commentId, "user")
        // check exist commenet
        if (!comment) throw new ForbiddenError("Comment not found");
        // check if comment hided by Admin/Mod
        if (!comment.isVisible) {
            throw new ResourceUnavailableError("Your comment hided")
        }
        // Check right update comment
        if (comment.user.userId !== userId) {
            throw new ConflictError("You can only update your own comments");
        }
        return await this.commentRepository.deleteComment(commentId);
    }

    // async hideComment(adminId: number, commentId: number) {
    //     // Check if adminId is admin/mod
    //     return this.commentRepository.hideComment(commentId);
    // }
}
