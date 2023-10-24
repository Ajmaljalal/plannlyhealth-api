import { Router } from 'express';

import {
  createRiskProfile
} from '../controllers/risk-profiles';


const router = Router();

router.post('/', createRiskProfile)


export default router;