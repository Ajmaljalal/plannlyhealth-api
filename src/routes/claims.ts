import { Router } from 'express';

import {
  createClaim,
  deleteClaim,
  getAllClaims,
  getClaimById,
  getClaimsByCompanyId,
  getClaimsByStatus,
  getClaimsByOwner,
  updateClaim,
} from '../controllers/claims';

const router = Router();

router.get('/', getAllClaims);
router.get('/:id', getClaimById);
router.get('/company/:id', getClaimsByCompanyId);
router.get('/owner/:id', getClaimsByOwner);
router.get('/status/:status', getClaimsByStatus);
router.post('/', createClaim);
router.put('/:id', updateClaim);
router.delete('/:id', deleteClaim);


export default router;
