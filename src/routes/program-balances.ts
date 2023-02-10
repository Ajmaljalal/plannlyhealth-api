import { Router } from 'express';

import {
  createProgramBalance,
  deleteProgramBalance,
  getAllProgramBalances,
  getProgramBalanceById,
  getProgramBalancesByCompanyId,
  getProgramBalancesByProgramId,
  updateProgramBalance,
} from '../controllers/program-balances';

const router = Router();

router.post('/', createProgramBalance);
router.get('/:id', getProgramBalanceById);
router.get('/', getAllProgramBalances)
router.get('/program/:programId', getProgramBalancesByProgramId);
router.get('/company/:companyId', getProgramBalancesByCompanyId);
router.put('/:id', updateProgramBalance);
router.delete('/:id', deleteProgramBalance);

export default router;