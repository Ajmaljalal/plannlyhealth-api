import { Router } from 'express';

import {
  createNewBenefitsProgram,
  deleteBenefitsProgram,
  getAllBenefitsPrograms,
  getBenefitsProgramById,
  getBenefitsProgramsByCompanyId,
  updateBenefitsProgram,
} from '../controllers/benefits-programs';

const router = Router();

router.post('/', createNewBenefitsProgram);
router.get('/', getAllBenefitsPrograms);
router.get('/:id', getBenefitsProgramById);
router.get('/company/:companyId', getBenefitsProgramsByCompanyId);
router.put('/:id', updateBenefitsProgram);
router.delete('/:id', deleteBenefitsProgram);

export default router;