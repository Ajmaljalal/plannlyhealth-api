import { Router } from 'express';

import {
  createDocument,
  getDocumentById,
  getDocumentsByCompanyId,
  getDocumentsByOwnerId,
  getAllDocuments,
  updateDocument,
  deleteDocument,
} from '../controllers/documents';

const router = Router();

router.post('/', createDocument);
router.get('/:id', getDocumentById);
router.get('/company/:id', getDocumentsByCompanyId);
router.get('/owner/:id', getDocumentsByOwnerId);
router.get('/', getAllDocuments);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);


export default router;