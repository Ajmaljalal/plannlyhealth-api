import { Router } from 'express';
import { createNewCompany, deleteCompany, getAllCompanies, getCompanyById, updateCompany } from '../controllers/company';

const router = Router();

router.get('/', getAllCompanies)
router.get('/:id', getCompanyById)
router.post('/', createNewCompany)
router.put('/:id', updateCompany)
router.delete('/:id', deleteCompany)

export default router;
