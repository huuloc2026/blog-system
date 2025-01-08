import { Post } from "modules/Post/post.entity";
import { User } from "modules/Users/user.entity";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";


@Entity("comments")
export class Comment {
    @PrimaryGeneratedColumn()
    idComment!: number;

    @Column({ type: "varchar", length: 250 })
    content!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ type: "boolean", default: true })
    isVisible!: boolean; // Admin/Mod có thể ẩn bình luận

    // Liên kết với bài viết
    @ManyToOne(() => Post, (post) => post.comments, { onDelete: "CASCADE" })
    post!: Post;

    // Liên kết với người dùng
    @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
    user!: User;

    // Liên kết với bình luận cha
    @ManyToOne(() => Comment, (comment) => comment.idComment, { nullable: true })
    parentComment?: Comment | number;

    // // Danh sách các phản hồi
    // @OneToMany(() => Comment, (comment) => comment.parentComment)
    // replies!: Comment[];
}
