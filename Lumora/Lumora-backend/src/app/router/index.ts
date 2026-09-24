
import express from 'express';
import { AuthRouter } from '../modules/Auth/auth.router';
import { UserRouter } from '../modules/User/user.router';
import { BlogRouter } from '../modules/Blog/blog.router';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRouter
    },
    {
        path: '/user',
        route: UserRouter
    },
    {
        path: '/blog',
        route: BlogRouter
    },
  
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;
