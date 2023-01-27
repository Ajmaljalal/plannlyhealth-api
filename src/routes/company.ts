// create a post route for company
import { Router } from 'express';
import { createNewCompany, getAllCompanies, getCompanyById, updateCompany } from '../controllers/company';

const router = Router();

router.get('/', getAllCompanies)
router.get('/:id', getCompanyById)
router.post('/', createNewCompany)
router.put('/:id', updateCompany)

export default router;
