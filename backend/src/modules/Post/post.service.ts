import AppDataSource from "database/data-source";
import { UserService } from "modules/Users/user.services";
import { Container, Service } from "typedi";
import { Post } from "./post.entity";
import { NotFoundError } from "utils/ApiError";
import { generateKeyPost } from "utils/GenerateKeyPost";
import { redisService } from "modules/Redis/redis.services";


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
    async getPostbyId(id:string,userId:any,bookmark?:boolean):Promise<any>{
        const { postKey } = generateKeyPost(id)
        // find from cache
        const check = await redisService.checkKey(postKey)

        if (check){
            console.log(`GET FROM CACHE::: key of Post have exist`);
            const resultCached = await redisService.getKeyPostInRedis(postKey)
            if(!resultCached) throw new NotFoundError("error found post from cache")
            await redisService.SaveViewdId(userId, resultCached)
            if (bookmark) {
                console.log(`saved bookmark when get cached`);
                await redisService.SaveBookmarkId(userId, resultCached)
            }
            return resultCached
        }
        console.log(`GET FROM DB...`);
        // find from db
        const post = await this.getNewsbyId(+id)
        await redisService.SaveViewdId(userId, post)
        const rs = await redisService.saveJsonPostToRedis(postKey, post)
        // saved viewd of User -> Key: ViewdPost:UserId
        if (!rs) { throw new Error("faild save post to cached") }
        if (bookmark) {
            console.log(`saved bookmark when get db`);
            await redisService.SaveBookmarkId(userId, post)
        }
        return post
    }

    async getBookmarkById(userid: string, page: number, limit: number):Promise<any>{
        const result = await redisService.GetSaveBookmarkId(userid, page, limit)
        return result
    }

    async getViewbyId(userid: string,page:number,limit:number): Promise<any> {
        const result = await redisService.GetViewdId(userid,page,limit)
        return result
    }


    //with pagination
    //https://stackoverflow.com/questions/53922503/how-to-implement-pagination-in-nestjs-with-typeorm
    async getNewsbyCatogory(categorySlug: string,take:number,skip:number): Promise<any> {
        // const post = await this.PostRepository.find({where: {
        //     category: categorySlug
        // }}) 
        const [result, total] = await this.PostRepository.findAndCount({
            where: {category:categorySlug},
            take: take,
            skip:skip,
        })
        console.log(`getNewsbyCatogory new post`);
        return {
            data: result,
            count: total
        }
    }

}
