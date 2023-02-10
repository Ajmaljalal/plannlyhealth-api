import { Router } from 'express';

import {
  createComment,
  getCommentById,
  getAllComments,
  getCommentsByAuthor,
  getCommentsByClaimId,
  updateComment,
  deleteComment
} from '../controllers/comments';

const router = Router();

router.post('/', createComment);
router.get('/', getAllComments);
router.get('/:id', getCommentById);
router.get('/author/:id', getCommentsByAuthor);
router.get('/claim/:id', getCommentsByClaimId);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;