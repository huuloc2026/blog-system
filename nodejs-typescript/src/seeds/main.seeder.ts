import { DataSource } from "typeorm";
import { Post } from "modules/Post/post.entity";
import { Faker, faker } from "@faker-js/faker";
// Usage example
import AppDataSource from "database/data-source";
import { PostFactory, UsersFactory } from "./User.factory";
import { User } from "modules/Users/user.entity";

const seedPosts = async (dataSource: DataSource) => {
    const postRepository = dataSource.getRepository(Post);
    const UserRepository = dataSource.getRepository(User);
    const mockPosts = Array.from({ length: 200 }, () => PostFactory(faker))
    const mockUsers = Array.from({ length: 20 }, () => UsersFactory(faker)); 
    await postRepository.save(mockPosts);
    console.log("Seeded posts into the database.");
    await UserRepository.save(mockUsers);
    console.log("Seeded users into the database.");
};


AppDataSource.initialize().then(async () => {
    await seedPosts(AppDataSource);
    process.exit(0);
});
