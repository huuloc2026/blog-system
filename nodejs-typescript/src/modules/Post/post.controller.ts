import { Container, Service } from "typedi";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { PostService } from "./post.service";
import { ApiError, AuthorizedError, NotFoundError } from "utils/ApiError";
import AsyncHandler from "utils/AsyncHandler";
import responseHandler from "utils/ResponseHandler";
import { STATUS_CODES } from "http";
import { StatusCodes } from "http-status-codes";
import { generateKeyPost } from "utils/GenerateKeyPost";
import { redisService } from "modules/Redis/redis.services";


@Service()
class PostController {
    constructor(
        private postService: PostService
    ) {
        this.postService = Container.get(PostService)
    }

    PostNews: RequestHandler = AsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const inputPost = await this.postService.createNews(req.body)
        //can not use this.newsPostService = Container.get(PostService)
        return responseHandler.success(res, StatusCodes.CREATED, inputPost, "created news successfully")

    })
    updateNews: RequestHandler = AsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const {id} = req.params
        const dataUpdate = req.body
        const checkNews = await this.postService.getNewsbyId(+id)
        
        // Cập nhật bài viết
        const updatedPost = await this.postService.updateNews(+id, dataUpdate);
        return responseHandler.success(res,StatusCodes.CREATED,updatedPost,"update successfully")
    })
    getPostbyId: RequestHandler = AsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const {id} = req.params
        if(!id) throw new NotFoundError("Not found Id")
        //step 1: check cache
        const { postKey } = generateKeyPost(id)
        const check = await redisService.checkKey(postKey)
        // if key exist in cached -> get from cached
        if (check){
            console.log(`GET FROM CACHE::: key of Post have exist`);
            const resultCached = await redisService.checkKeyPostInRedis(postKey)
            return responseHandler.success(res, StatusCodes.ACCEPTED, resultCached, "get successfully with id")
        }
        //step 2: if NOT -> get in database and save in cache
        console.clear()
        console.log(`GET FROM DB...`);
        const findPostbyId = await this.postService.getNewsbyId(+id)
        //step 3: save cache 
        const rs = await redisService.saveJsonPostToRedis(postKey, findPostbyId)
        if(!rs){throw new Error("faild save post to cached")}
        return responseHandler.success(res, StatusCodes.ACCEPTED, findPostbyId, "get successfully with id")
        })
    getPostbyCategory: RequestHandler = AsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const { categorySlug } = req.params
        //step 1. check cache

        //step 2. get from repo Post 
        //step 3. check slug exist 
        //step 4. save to cache
        
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = Number((page - 1) * limit)
        const checkNewsExist = await this.postService.getNewsbyCatogory(categorySlug)
        console.log(checkNewsExist.length);
        const dataSlice = checkNewsExist.slice(offset)
        console.log(dataSlice.length);
        return res.status(201).json(
            {
                "message": `successfully getPostbyCategory ${categorySlug}`,
                "data": dataSlice,
            })
        
        // const result = await this.newsPostService.getNewsbyCatogory({catoSlug:categorySlug,page,limit})
        // console.log(result);
        // res.status(200).json(result);
        return res.send(`getPostbyCategory news oke`)
    })
}

export default PostController;

