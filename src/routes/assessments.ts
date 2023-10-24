import { Router } from 'express';
import {
  createAssessment,
  getAssessmentById,
  getAssessmentyByUserId,
  getAssessmentsByCompanyId,
  updateAssessment,
  startBaselineAssessment,
} from '../controllers/assessments';

const router = Router();


router.get('/baseline', startBaselineAssessment)
router.get('/:id', getAssessmentById)
router.get('/user/:userId', getAssessmentyByUserId)
router.get('/company/:companyId', getAssessmentsByCompanyId)
router.post('/', createAssessment)
router.put('/:id', updateAssessment)

export default router;