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

PostRouter.get("/getpost/:id", postContorller.getPostbyId);

PostRouter.get("/catagory/:categorySlug", postContorller.getPostbyCategory);

PostRouter.use(authorizationMiddleware([ROLE.ADMIN,ROLE.MOD]))
PostRouter.post("/createnewpost",validateMiddleware(CreateNewsPostDTO) ,postContorller.PostNews);

PostRouter.put("/updatepost/:id", validateMiddleware(UpdateNewsDTO), postContorller.updateNews);







export default PostRouter;
