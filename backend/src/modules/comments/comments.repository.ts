
import AppDataSource from "database/data-source";
import { Service } from "typedi";
import { ConflictError, NotFoundError } from "utils/ApiError";
import { Comment } from "./comment.entity";
import { User } from "modules/Users/user.entity";
import { Post } from "modules/Post/post.entity";


@Service()
export class CommentRepository {
    private repository = AppDataSource.getRepository(Comment);
    async findById(id: number) {
        const checkexist = await this.repository.findOne({ where: { idComment:id } })
        if (!checkexist) throw new NotFoundError("Can not found")
        return checkexist
    }
    async findByParentComment(parentId: number): Promise<any> {
        const checkexist = await this.repository.findOne({ where: { idComment: parentId } })
        if (!checkexist) throw new NotFoundError("findByParentComment can not found")
        return checkexist
        //return await this.repository.findOneBy({parentComment:parentId});
    }

    async hasCommentedOnPost(userId: number, postId: number): Promise<boolean> {
        const comment = await this.repository.findOne({ where: { user: { userId }, post: { id: postId } } });
        return !!comment;
    }

    async findUniqueComment(userId: number, postId: number): Promise<Comment | null> {
   
        return this.repository.findOne({
            where: { user: { userId: userId }, post: { id: postId } },
        });
    }

    async createComment(data: {
        content: string;
        user: User;
        post: Post;
        parentComment?: Comment;
    }): Promise<Comment> {
        const comment = new Comment();
        comment.user = data.user;
        comment.content = data.content;
        comment.post = data.post;
        if (data.parentComment) {
            comment.parentComment = data.parentComment;
        }
        return await this.repository.save(comment);
    }

    // async getCommentsByPost(postId: number): Promise<Comment[]> {
    //     return this.repository.find({
    //         where: { post: { id: postId }, isVisible: true, parentComment: null },
    //         relations: ["user", "replies", "replies.user"],
    //         order: { id: "ASC" },
    //     });
    // }

    // async updateComment(commentId: number, content: string): Promise<Comment> {
    //     const comment = await this.repository.findOne({ where: { id: commentId } });
    //     if (!comment) throw new Error("Comment not found");
    //     comment.content = content;
    //     return this.repository.save(comment);
    // }

    // async deleteComment(commentId: number): Promise<void> {
    //     await this.repository.delete(commentId);
    // }

    // async hideComment(commentId: number): Promise<Comment> {
    //     const comment = await this.repository.findOne({ where: { id: commentId } });
    //     if (!comment) throw new Error("Comment not found");
    //     comment.isVisible = false;
    //     return this.repository.save(comment);
    // }
}
