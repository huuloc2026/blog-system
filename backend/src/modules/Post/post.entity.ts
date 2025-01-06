import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("posts")
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type:"varchar",length: 250 })
    title!: string;

    @Column("text")
    content!: string;

    @Column({ type: "varchar", length: 2048 })
    thumbnail!: string;

    @Column({ type: "varchar",length: 125 })
    category!: string;

    @Column({ type: "datetime", default: () => "now()" })
    dateTime!: Date;

    @Column({ type: "varchar", length: 125, })
    author!: string;

    @Column("simple-array")
    tags!: string[];

    @Column({ type: "enum", enum: ["Draft", "Published", "Deleted"] })
    status!: string;

    @Column({ type: "varchar", length: 500 })
    description!: string;

    @Column({ type: "int", default: 0 })
    views!: number;

    @Column({type: "int", default: 0 })
    commentsCount!: number;

    // constructor(id: number, title: string, content: string, category: string, dateTime: Date, author: string, tags: string[], status: string, description: string, views: number, commentsCount: number){
    //     this.id = id
    //     this.title = title
    //     this.content = content
    //     this.category = category
    //     this.dateTime = dateTime
    //     this.author = author
    //     this.tags = tags
    //     this.status = status
    //     this.description = description
    //     this.views= views
    //     this.commentsCount = commentsCount
    // }
}
