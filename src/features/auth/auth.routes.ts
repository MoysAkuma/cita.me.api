import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.schema';
import * as authController from './auth.controller';

const router = Router();

router.post('/register', validate({ body: registerSchema }), authController.register);
router.post('/login', validate({ body: loginSchema }), authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh', validate({ body: refreshTokenSchema }), authController.refresh);

export default router;
