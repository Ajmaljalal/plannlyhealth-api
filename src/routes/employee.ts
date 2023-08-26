// create a post route for company
import { Router } from 'express';
import { createEmployee, deleteEmployee, getAllEmployees, getEmployeeById, getEmployeeByEmail, updateEmployee, getEmployeesByCompanyId, inviteNewUser } from '../controllers/employee';

const router = Router();

router.get('/', getAllEmployees)
router.get('/:id', getEmployeeById)
router.get('/company/:id', getEmployeesByCompanyId)
router.get('/email/:email', getEmployeeByEmail)
router.post('/', createEmployee)
router.put('/:id', updateEmployee)
router.delete('/:id', deleteEmployee)
router.post('/inviteNewUser', inviteNewUser)

export default router;