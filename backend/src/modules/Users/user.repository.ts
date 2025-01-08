import AppDataSource from "database/data-source";
import { Service } from "typedi";
import { User } from "./user.entity";
import { NotFoundError } from "utils/ApiError";

@Service()
export class UserRepository {
    private repository = AppDataSource.getRepository(User);

    async findById(id: number):Promise<User> {
        const checkexist = await this.repository.findOne({ where: { userId: id } })
        if (!checkexist) {
            throw new NotFoundError("user not found")
        }
        return checkexist
    }
}