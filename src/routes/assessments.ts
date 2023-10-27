import { Router } from 'express';
import {
  createAssessment,
  getAssessmentById,
  getAssessmentsyByUserId,
  getAssessmentsByCompanyId,
  updateAssessment,
  generateBaselineAssessment,
  generateMonthlyAssessment,
  getAssessmentProgress,
  createAssessmentProgress
} from '../controllers/assessments';

const router = Router();


router.get('/baseline', generateBaselineAssessment)
router.get('/monthly/:type', generateMonthlyAssessment)
router.get('/:id', getAssessmentById)
router.get('/user/:userId', getAssessmentsyByUserId)
router.get('/company/:companyId', getAssessmentsByCompanyId)
router.post('/', createAssessment)
router.put('/:id', updateAssessment)

router.get('/progress/:employeeId', getAssessmentProgress)
router.post('/progress', createAssessmentProgress)



export default router;