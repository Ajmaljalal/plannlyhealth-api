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
  createBulkUsers
} from '../controllers/invited-user';

const router = Router();

router.post('/invite', createNewUser);
router.post('/bulk-invite/:companyId', createBulkUsers);
router.get('/:id', getNewUserById);
router.get('/email/:email', getNewUserByEmail);
router.get('/fname/:firstName', getNewUserByFirstName);
router.get('/lname/:lastName', getNewUserByLastName);
router.get('/company/:companyId', getNewUsersByCompanyId);
router.put('/:id', updateNewUser);
router.delete('/:id', deleteNewUser);

export default router;