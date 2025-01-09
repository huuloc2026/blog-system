import { faker, Faker } from "@faker-js/faker";
import { NewsCatogories } from "modules/Post/DTO/CreateNewsPostDTO";
import { Post } from "modules/Post/post.entity";
import { User } from "modules/Users/user.entity";
import { setSeederFactory } from "typeorm-extension";



export const UsersFactory = (faker: Faker) => {
    const user = new User();
    user.name = faker.internet.userName();
    user.email = faker.internet.email();
    user.password = "123456"
    user.phoneNumber = (faker.number.int({ min: 10,max:10 })).toString()
    user.role = faker.helpers.arrayElement(["User"]);
    return user;
};

export const AdminFactory = async (faker: Faker) => {
    const user = new User();
    user.name = faker.internet.userName();
    user.email = "admin@gmail.com"
    user.password = "123456"
    user.phoneNumber = (faker.number.int({ min: 10, max: 10 })).toString()
    user.role = faker.helpers.arrayElement(["Admin"]);
    return user;
};
export const ModFactory = (faker: Faker) => {
    const user = new User();
    user.name = faker.internet.userName();
    user.email = "mod@gmail.com"
    user.password = "123456"
    user.phoneNumber = (faker.number.int({ min: 10, max: 10 })).toString()
    user.role = faker.helpers.arrayElement(["Moderator"]);
    return user;
};

export const PostFactory = (faker: Faker) => {
    const post = new Post();
    post.title = faker.lorem.sentence();
    post.content = faker.lorem.paragraphs(2);
    post.thumbnail = faker.image.avatar()
    post.tags = faker.helpers.uniqueArray(faker.lorem.word, 5);
    post.category = faker.helpers.arrayElement(Object.values(NewsCatogories));
    post.author = faker.internet.userName();
    post.status = faker.helpers.arrayElement(['Draft', 'Published', 'Deleted']); 
    post.description = faker.lorem.paragraph(1);
    post.views = faker.number.int({ min: 0, max: 1000 }); 
    post.commentsCount = faker.number.int({ min: 0, max: 1000 }); 
    return post;
};
export const generatePosts = (count: number) => {
    return Array.from({ length: count }, () => PostFactory(faker));
};