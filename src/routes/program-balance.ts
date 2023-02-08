import { Router } from 'express';

import {
  createProgramBalance,
  deleteProgramBalance,
  getProgramBalanceById,
  getProgramBalanceByCompanyId,
  getProgramBalanceByProgramId,
  updateProgramBalance,
} from '../controllers/program-balance';


const router = Router();

router.post('/', createProgramBalance);
router.get('/:id', getProgramBalanceById);
router.get('/program/:programId', getProgramBalanceByProgramId);
router.get('/company/:companyId', getProgramBalanceByCompanyId);
router.put('/:id', updateProgramBalance);
router.delete('/:id', deleteProgramBalance);

export default router;