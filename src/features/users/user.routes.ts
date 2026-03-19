import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { updateUserSchema, updatePhotoSchema } from './user.schema';
import * as userController from './user.controller';

const router = Router();

router.get('/', authenticate, userController.getAllUsers);
router.get('/:id', authenticate, userController.getUserById);
router.put('/:id', authenticate, validate({ body: updateUserSchema }), userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);
router.patch('/:id/photo', authenticate, validate({ body: updatePhotoSchema }), userController.updateProfilePhoto);

export default router;
