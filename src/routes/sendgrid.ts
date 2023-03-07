import { Router } from 'express';
import { sendEmail } from '../controllers/sendgrid/email';

const router = Router();

router.post('/email', sendEmail);

export default router;