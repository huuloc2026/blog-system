
import AuthController from 'modules/Auth/auth.controller';
import { LoginDTO } from 'modules/Auth/DTO/LoginDTO';
import express from 'express';
import { validateMiddleware } from 'middlewares/validateMiddleware';
import { RegisterNewUser } from './DTO/RegisterDTO';
import { authenticateAccessToken } from 'middlewares/authenticateAccessToken';
import {Container} from 'typedi';
import { AuthService } from './auth.services';
import { UserService } from 'modules/Users/user.services';



const AuthRouter = express.Router();

const authCtrl = Container.get(AuthController)
// console.log(authCtrl);
// console.log(Container.get(UserService));



// Login 
AuthRouter.post('/register',validateMiddleware(RegisterNewUser),authCtrl.Register)
AuthRouter.post("/verifycode",authenticateAccessToken, authCtrl.Verify);
AuthRouter.post("/login", validateMiddleware(LoginDTO), authCtrl.Login);
AuthRouter.post("/logout", authenticateAccessToken,authCtrl.Logout);  

AuthRouter.post("/refreshtoken",authCtrl.refreshAccessToken);

if (process.env.NODE_ENV === "development") {
  AuthRouter.get("/testHandlerAsync", authCtrl.TestHandleAsync);
}
  /* FOR SET COOKIES
// AuthRouter.get('/refreshtoken', AuthController.refreshAccessToken) 

// AuthRouter.post('/refreshtoken',AuthController.logout) // Log out
*/
  export default AuthRouter;
