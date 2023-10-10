import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  authenticateUser,
  setupUserAccount,
} from '../controllers/auth';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/authenticateUser', authenticateUser)
router.post('/activate-account', setupUserAccount)



export default router;
