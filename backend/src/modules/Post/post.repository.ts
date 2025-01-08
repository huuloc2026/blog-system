import AppDataSource from "database/data-source";
import { Service } from "typedi";
import { Post } from "./post.entity";
import { NotFoundError } from "utils/ApiError";


@Service()
export class PostRepository {
    private repository = AppDataSource.getRepository(Post);
    async findById(id: number) :Promise<any> {
        const checkexist = await this.repository.findOne({where:{id}})
        if (!checkexist) throw new NotFoundError("post not found")
        return checkexist
    }
}