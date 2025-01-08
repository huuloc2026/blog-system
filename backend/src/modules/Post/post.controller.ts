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
        return responseHandler.success(res, StatusCodes.CREATED, inputPost, "created news successfully")

    })
    updateNews: RequestHandler = AsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const { id } = req.params
        const dataUpdate = req.body
        const updatedPost = await this.postService.updateNews(+id, dataUpdate);
        return responseHandler.success(res, StatusCodes.CREATED, updatedPost, "update successfully")
    })
    //TODO: notes oke but need refactor
    // have 2 features save bookmark and viewd news
    getNewsbyId: RequestHandler = AsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const { id } = req.params
        const {bookmark} = req.body
        let isBookmark = false
        if(bookmark){
            isBookmark = true
        }
        const {userId,email} = req
        if (!id || !userId) throw new NotFoundError("Not found")
        return responseHandler.success(res,
            StatusCodes.ACCEPTED,
            await this.postService.getPostbyId(id, email, isBookmark),
            "get successfully with id")
    }
    )
    getBookmark: RequestHandler = AsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const { email } = req
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        if (!email) throw new NotFoundError("userId Not found")
        return responseHandler.success(res,
            StatusCodes.ACCEPTED,
            await this.postService.getBookmarkById(email,page,limit),
            "getBookmark successfully with id")
    })

    getviewd: RequestHandler = AsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const {email} = req
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        if (!email) throw new NotFoundError("userId Not found")
        return responseHandler.success(res,
            StatusCodes.ACCEPTED,
            await this.postService.getViewbyId(email,page,limit),
            "getBookmark successfully with id")
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

        const checkNewsExist = await this.postService.getNewsbyCatogory(categorySlug, limit, offset)
        console.log(checkNewsExist);
        return res.send(checkNewsExist)
        //const checkNewsExist = await this.postService.getNewsbyCatogory(categorySlug)
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

