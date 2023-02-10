import { Router } from 'express';

import {
  createDeal,
  deleteDeal,
  getAllDeals,
  getDealById,
  updateDeal,
} from '../controllers/deals';


const router = Router();

router.get('/', getAllDeals);
router.get('/:id', getDealById);
router.post('/', createDeal);
router.put('/:id', updateDeal);
router.delete('/:id', deleteDeal);

export default router;

