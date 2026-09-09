
import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';


const router = express.Router();

router.get(
    '/me',
    auth(),
    userController.getMyProfile
);


export const UserRouter = router;