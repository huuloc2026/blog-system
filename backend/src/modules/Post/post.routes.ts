import express from 'express';

import { validateMiddleware } from 'middlewares/validateMiddleware';

import { authenticateAccessToken } from 'middlewares/authenticateAccessToken';
import { Container } from 'typedi';


import PostController  from './post.controller';
import { CreateNewsPostDTO } from './DTO/CreateNewsPostDTO';
import { authorizationMiddleware } from 'middlewares/authoraztionmiddleware';
import { ROLE } from 'CONSTANT/role.enum';
import { UpdateNewsDTO } from './DTO/UpdateNewsDTO';


const PostRouter = express.Router();

const postContorller = Container.get(PostController);



//validateMiddleware(CreateNewsPostDTO)

PostRouter.use(authenticateAccessToken)
//get by id
PostRouter.get("/getpost/:id", postContorller.getNewsbyId);

// get by category with pagination
PostRouter.get("/catagory/:categorySlug", postContorller.getPostbyCategory);
//bookmark with pagination
PostRouter.get("/getbookmark/", postContorller.getBookmark);
//viewd with pagination
PostRouter.get("/getviewd/", postContorller.getviewd);


PostRouter.use(authorizationMiddleware([ROLE.ADMIN,ROLE.MOD]))
//create news
PostRouter.post("/createnewpost",validateMiddleware(CreateNewsPostDTO) ,postContorller.PostNews);
//update news
PostRouter.put("/updatepost/:id", validateMiddleware(UpdateNewsDTO), postContorller.updateNews);







export default PostRouter;
