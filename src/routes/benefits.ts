import { Router } from 'express';

import {
  createNewBenefits,
  deleteBenefits,
  getAllBenefits,
  getBenefitsById,
  getBenefitsByCompanyId,
  updateBenefits,
} from '../controllers/benefits';

const router = Router();

router.post('/', createNewBenefits);
router.get('/', getAllBenefits);
router.get('/:id', getBenefitsById);
router.get('/company/:companyId', getBenefitsByCompanyId);
router.put('/:id', updateBenefits);
router.delete('/:id', deleteBenefits);

export default router;