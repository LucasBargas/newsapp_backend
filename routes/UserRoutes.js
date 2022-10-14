import express from 'express';
import UsersController from '../controllers/UsersController';
import CheckToken from '../middlewares/CheckToken';

const router = express.Router();

router.post('/register', UsersController.registerUser);
router.post('/login', UsersController.loginUser);
router.get(
  '/auth-user',
  CheckToken.handleCheckToken,
  UsersController.getAuthUser,
);
router.patch('/edit', CheckToken.handleCheckToken, UsersController.editUser);
router.delete(
  '/delete',
  CheckToken.handleCheckToken,
  UsersController.deleteUser,
);

export default router;
