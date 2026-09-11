
import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';


const router = express.Router();

router.get(
    '/me',
    auth(),
    userController.getMyProfile
);

router.get(
    '/allUser',
    auth("ADMIN"),
    userController.getALlUser
);

router.delete(
    '/:id',
    auth("ADMIN"),
    userController.deleteUser
);

router.patch(
    '/profile',
    auth(),
    userController.updateMyProfile
);



export const UserRouter = router;