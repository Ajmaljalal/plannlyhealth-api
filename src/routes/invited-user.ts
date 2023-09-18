import { Router } from 'express';

import {
  createNewUser,
  getNewUserById,
  getNewUserByEmail,
  getNewUserByFirstName,
  getNewUserByLastName,
  getNewUsersByCompanyId,
  updateNewUser,
  deleteNewUser,
  inviteNewUser,
} from '../controllers/invited-user';

const router = Router();

router.post('/', createNewUser);
router.post('/inviteNewUser', inviteNewUser)
router.get('/:id', getNewUserById);
router.get('/email/:email', getNewUserByEmail);
router.get('/fname/:firstName', getNewUserByFirstName);
router.get('/lname/:lastName', getNewUserByLastName);
router.get('/company/:companyId', getNewUsersByCompanyId);
router.put('/:id', updateNewUser);
router.delete('/:id', deleteNewUser);

export default router;