import AppDataSource from "database/data-source";
import { UserService } from "modules/Users/user.services";
import { Container, Service } from "typedi";
import { Post } from "./post.entity";
import { NotFoundError } from "utils/ApiError";


@Service()
export class PostService {
    private PostRepository = AppDataSource.getRepository(Post)
    

    async createNews(data: any): Promise<any> {
        const testData = this.PostRepository.save({...data})
        return testData
    }

    async updateNews(id: number, data: Partial<Post>): Promise<Post> {
        // Check post exist
        const postToUpdate = await this.PostRepository.findOne({ where: { id } });
        if (!postToUpdate) {
            throw new Error("Post not found");
        }

        // Update
        const updatedPost = Object.assign(postToUpdate, data);
        return await this.PostRepository.save(updatedPost)
    }
    async getNewsbyId(id:number): Promise<any> {
        const post = await this.PostRepository.findOneBy({ id });
        if(!post) throw new NotFoundError(`Not found post with id: ${id}`)
        return post
    }

    async getNewsbyCatogory(categorySlug: string): Promise<any> {
        const post = await this.PostRepository.find({where: {
            category: categorySlug
        }}) 
        console.log(`getNewsbyCatogory new post`);
        return post
    }

}
