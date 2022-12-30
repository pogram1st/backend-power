import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import checkAuth from '../utils/checkAuth.js';

const router = new Router();

router.post('/auth/register', UserController.register);
router.post('/auth/login', UserController.login);
router.put('/user/update', checkAuth, UserController.updateUser);
router.get('/auth/me', checkAuth, UserController.getMe);
router.delete('/user/delete/:id', checkAuth, UserController.deleteUser);

export default router;
