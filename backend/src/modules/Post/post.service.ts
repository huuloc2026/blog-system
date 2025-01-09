import AppDataSource from "database/data-source";
import { UserService } from "modules/Users/user.services";
import { Container, Service } from "typedi";
import { Post } from "./post.entity";
import { ConflictError, NotFoundError, ResourceUnavailableError } from "utils/ApiError";
import { generateKeyPost, generateSlugKeyPost } from "utils/GenerateKeyPost";
import { redisService } from "modules/Redis/redis.services";


@Service()
export class PostService {
    private PostRepository = AppDataSource.getRepository(Post)
    
    //return news -> "Published"
    async checkNewsPublished(id: number): Promise<any> {
        const post = await this.PostRepository.findOneBy({ id });
        if (!post) throw new NotFoundError(`Not found post with id: ${id}`)
        if (post.status !== "Published") {
            throw new ResourceUnavailableError("This post could be un-published or deleted")
        }
        return post
    }

    async createNews(data: any): Promise<any> {
        const testData = this.PostRepository.save({...data})
        return testData
    }

    async updateNews(id: number, data: Partial<Post>): Promise<any> {
        // Check post exist
        const postToUpdate = await this.PostRepository.findOneBy({ id });
        if (!postToUpdate) {
            throw new NotFoundError("Post not found");
        }
        // Update
        const updatedPost = Object.assign(postToUpdate, data);
        //generate to check key
        const {postKey} = generateKeyPost(id)
        // change post in redis
        await redisService.saveJsonPostToRedis(postKey,updatedPost)
        console.log(`Updated new post in redis`);
        return await this.PostRepository.save(updatedPost)
    }
    
    async getPostbyId(id:string,userId:any,bookmark?:boolean):Promise<any>{
        const { postKey } = generateKeyPost(id)
        // find key exist from cache
        const isCached = await redisService.checkKey(postKey)
        
        // yes -> get from ache
        if (isCached){
            console.log(`GET FROM CACHE::: key of Post have exists`);
            const {cachedPost} = await redisService.getKeyPostInRedis(postKey);
            //****************save to viewd when get
            const viewedData = await redisService.SaveViewdId(userId, cachedPost);
            if (bookmark) {
                await redisService.SaveBookmarkUser(userId, cachedPost)
            }
            return cachedPost
        }
        console.log(`GET FROM DB...`);
        // no -> get from db
        // Fetch post from DB
        const post = await this.checkNewsPublished(+id);

        //**************** */ Save post to viewed and cache
        //save to viewd when get 
        const viewedData = await redisService.SaveViewdId(userId, post);
        // saved news to redis
        const cacheSaveResult = await redisService.saveJsonPostToRedis(postKey, post)
        // saved viewd of User -> Key: ViewdPost:UserId
        if (!cacheSaveResult) { 
            throw new NotFoundError("Failed to save post to cache")
        }
        if (bookmark) {
            await redisService.SaveBookmarkUser(userId, post)
        }
        return post
    }

    async getBookmarkById(userid: string, page: number, limit: number):Promise<any>{
        const result = await redisService.GetSavedBookmarkUser(userid, page, limit)
        return result
    }

    async getViewbyId(userid: string,page:number,limit:number): Promise<any> {
        const result = await redisService.GetViewdId(userid,page,limit)
        return result
    }


    //with pagination
    //https://stackoverflow.com/questions/53922503/how-to-implement-pagination-in-nestjs-with-typeorm
    async getNewsbyCatogory(categorySlug: string,page:number,limit:number): Promise<any> {
        const {SlugKey} = generateSlugKeyPost(categorySlug,page)

        //step 1. check cache
        const checkCached = await redisService.checkKey(SlugKey)
        if(checkCached){
            const {cachedPost} = await redisService.getKeyPostInRedis(SlugKey)
            return cachedPost
        }
        //step 3. get from repo Post 
        console.log(`Get from db`);
        const offset = Number((page - 1) * limit)
        // check limit match volume 
        const [result, total] = await this.PostRepository.findAndCount({
            where: {category:categorySlug,status:"Published"},
            take: limit,
            skip: offset,
        })
        const data = {
            result,
            total,
            currentpage: page,
            totalPages: Math.ceil(total / limit)
        }
        //step 4. save to cache
        if (result.length>0){
            const testSavedCached = await redisService.saveJsonPostToRedis(SlugKey,data)
            if(!testSavedCached) throw new ConflictError("Error saved cached")
        }
        return data
    }

}
