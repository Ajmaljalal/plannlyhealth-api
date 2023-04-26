// create a post route for company
import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser, getUsersByCompanyId, inviteNewUser } from '../controllers/user';

const router = Router();

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.get('/company/:id', getUsersByCompanyId)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.post('/inviteNewUser', inviteNewUser)

export default router;