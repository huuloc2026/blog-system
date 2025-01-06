import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        export interface Request {
        token?:string
        decoded?:JwtPayload
        userId?:number
        salt?:string
        email?:string
        }
    }
}
