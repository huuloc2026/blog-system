import { Request, Response, NextFunction } from "express";
import AsyncHandler from "utils/AsyncHandler";
import { AuthorizedError, NotFoundError } from "utils/ApiError";
import { UserService } from "modules/Users/user.services";

const userService = new UserService()
export const authorizationMiddleware = (role: string[]) => {
    return AsyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { email } = req
            try {
                if (!email) throw new NotFoundError("Not found email!!")
                const checkRole = await userService.findbyEmail(email)
                if(!role.includes(checkRole.role)){
                    throw new AuthorizedError("Your role not access this route!!")
                }
                next();
            } catch (error) {
                throw error
            }
        }
    );
}
