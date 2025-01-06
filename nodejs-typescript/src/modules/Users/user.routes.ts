import express from 'express';
import UserController from 'modules/Users/user.controllers';
import { validateMiddleware } from 'middlewares/validateMiddleware';
import { ChangePasswordDTO, CreateUserDTO, GetUserbyIdDTO, RegisterNewUserDTO, UpdateInforUserDTO } from 'modules/Users/user.dto';
import { authenticateAccessToken } from 'middlewares/authenticateAccessToken';
import {Container} from 'typedi';

const UserRouter = express.Router();


const userController = Container.get(UserController);

// Tạo mới người dùng
UserRouter.post(
  "/createnewUser",
  validateMiddleware(RegisterNewUserDTO),
  userController.createUser
);

UserRouter.post(
  "/changepassword",
  authenticateAccessToken,
  validateMiddleware(ChangePasswordDTO),
  userController.ChangePasswordUser
);

// // Lấy tất cả người dùng
UserRouter.get(
  "/getAllUsers",
  authenticateAccessToken,
  userController.getUsers
);

UserRouter.put(
  "/updateinfo",
  authenticateAccessToken,
  validateMiddleware(UpdateInforUserDTO),
  userController.UpdateInforUser
);

// // Lấy người dùng theo ID
// UserRouter.get('/getUserById/:id', validateMiddleware(GetUserbyIdDTO),UserController.getUserById);

// // Cập nhật thông tin người dùng
// UserRouter.put('/updateUser/:id',validateMiddleware(UpdateUserDTO) , UserController.updateUser);

// // Xóa người dùng
// UserRouter.delete('/deleteUser/:id', validateMiddleware(DeleteUserDTO), UserController.deleteUser);

export default UserRouter;
