import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import {
  createAssessmentProgressTrackerService,
  createAssessmentService,
  getAssessmentByIdService,
  getAssessmentProgressTrackerService,
  getAssessmentsByCompanyIdService,
  getAssessmentsByUserIdService,
  updateAssessmentProgressTrackerService,
  updateAssessmentService
} from '../services/assessments';
import {
  Assessment,
  CreateAssessmentSchema,
  UpdateAssessmentSchema
} from '../models/assessments';
import {
  calculateScores,
  extractQuestions,
  getAssessmentProgressStatus
} from '../lib/helpers';
import {
  burnout_questions_bank,
  turnover_questions_bank,
  workload_questions_bank
} from '../lib/assessment/questions_bank';

const questions: any = {
  burnout: burnout_questions_bank,
  workload: workload_questions_bank,
  turnover: turnover_questions_bank
}

export const generateBaselineAssessment = async (req: Request, res: Response) => {
  try {
    const questions = extractQuestions()
    if (questions.length) {
      return res.status(200).json(questions);
    }
  } catch (err: any) {
    console.error('ERROR: ', err)
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}

export const generateMonthlyAssessment = async (req: Request, res: Response) => {
  const assessmentType = req.params.type;
  try {
    const currentAssessmentQuestions = questions[assessmentType]
    if (currentAssessmentQuestions.length) {
      return res.status(200).json(currentAssessmentQuestions);
    }
  } catch (err: any) {
    console.error('ERROR: ', err)
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}

export const createAssessment = async (req: any, res: Response) => {
  const assessment = req.body;

  // 1. check if the request body is empty
  if (!Object.keys(assessment).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  // 2. modify the assessment object to add the required fields
  const risk_scores = calculateScores(assessment);
  const newAssessment: Assessment = {
    ...assessment,
    id: uuid(),
    is_completed: true,
    created_at: Date(),
    modified_at: Date(),
    risk_scores: risk_scores,
  };

  // 3. validate the request body before creating the assessment using the CreateassessmentSchema
  const { error } = CreateAssessmentSchema.validate(newAssessment);
  if (error) {
    console.log('ERROR: ', error)
    return res.status(400).json({
      message: error.details[0].message,
      code: 'INVALID_REQUEST_BODY'
    });
  }

  // 4. call the createAssessmentService to create the assessment
  try {
    const response: any = await createAssessmentService(newAssessment);
    // 5. check if the response is an error
    if (response.code) {
      console.log('ERROR: ', response)
      return res.status(response.statusCode || 400).json({
        message: response.message,
        code: response.code
      });
    } else {
      return res.status(200).json(response.Item);
    }
  }
  catch (err: any) {
    // 7. catch any other error and send the error message
    console.log('ERROR: ', err)
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getAssessmentById = async (req: Request, res: Response) => {
  const assessmentId: string = req.params.id;

  try {
    const response: any = await getAssessmentByIdService(assessmentId);

    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code,
      });
    } else {
      return res.status(200).json(response.Item);
    }
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}

export const getAssessmentsyByUserId = async (req: Request, res: Response) => {
  const userId: string = req.params.userId;

  try {
    const response: any = await getAssessmentsByUserIdService(userId);

    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code,
      });
    } else {
      return res.status(200).json(response.Item);
    }
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}

export const getAssessmentsByCompanyId = async (req: Request, res: Response) => {
  const companyId: string = req.params.companyId;

  try {
    const response: any = await getAssessmentsByCompanyIdService(companyId);

    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code,
      });
    } else {
      return res.status(200).json(response.Items);
    }
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}

export const updateAssessment = async (req: any, res: Response) => {
  const assessmentId: string = req.params.id;
  const assessment: Partial<Assessment> = req.body;
  // remove company_id and id and create_at, as it is not allowed to be updated
  delete assessment.company_id;
  delete assessment.id;
  delete assessment.user_id;
  delete assessment.created_at;
  delete assessment.type;

  const { error: validationError } = UpdateAssessmentSchema.validate(assessment);
  if (validationError) {
    return res.status(400).json({
      message: validationError.details[0].message,
      error: 'INVALID_REQUEST_BODY',
      code: 400,
    });
  }

  try {
    const existingassessment = await getAssessmentByIdService(assessmentId) as any;
    if (!existingassessment.Item) {
      return res.status(404).json({
        message: 'assessment not found',
        error: 'assessment_NOT_FOUND',
        code: 404,
      });
    }

    // const currentUser = req.user;
    // const isAuthorized =
    //   [Role.Admin, Role.SuperAdmin, Role.Owner, Role.WellnessCoordinator, Role.ProgramAdmin].includes(currentUser?.role) ||
    //   currentUser?.id === existingassessment.Item?.id;

    // if (!isAuthorized) {
    //   return res.status(403).json({
    //     message: 'You are not authorized to perform this action',
    //     error: 'NOT_AUTHORIZED',
    //     code: 403,
    //   });
    // }

    delete existingassessment.Item?.id;
    delete existingassessment.Item?.company_id

    const updatedassessment = { ...existingassessment.Item, ...assessment, modified_at: Date() };
    const response = await updateAssessmentService(assessmentId, updatedassessment) as any

    if (response?.code || response?.statusCode >= 400) {
      return res.status(response.statusCode).json({
        message: response.message,
        error: response.code,
        code: response.statusCode,
      });
    }

    return res.status(200).json(response.Attributes);
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
      error: 'INTERNAL_SERVER_ERROR',
      code: 500,
    });
  }
}

export const createAssessmentProgressTracker = async (req: any, res: any) => {
  const employee = req.body;

  if (!employee) {
    return res.status(400).json({
      message: 'INVALID_REQUEST_BODY',
      code: 'BAD_REQUEST',
    });
  }

  try {
    const assessmentProgress = {
      ...employee,
      last_assessment_date: new Date(),
      onboarding_assessment_completed: false,
    }

    const response: any = await createAssessmentProgressTrackerService(assessmentProgress);
    if (response && response.code) {
      console.log('ERROR: ', response)
      return res.status(response.statusCode || 400).json({
        message: response.message,
        code: response.code,
      });
    } else {
      return res.status(201).json(response.Item);
    }
  } catch (err: any) {
    console.log('ERROR: ', err)
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}

export const getAssessmentProgressTracker = async (req: any, res: any) => {
  const employeeId = req.params.employeeId;

  if (!employeeId) {
    return res.status(400).json({
      message: 'INVALID_REQUEST_BODY',
      code: 'BAD_REQUEST',
    });
  }

  try {
    const response: any = await getAssessmentProgressTrackerService(employeeId);

    if (response && response.code) {
      console.log('ERROR: ', response.message)
      return res.status(response.statusCode || 400).json({
        message: response.message,
        code: response.code,
      });
    } else {
      const progressStatus = getAssessmentProgressStatus(response);
      return res.status(200).json(progressStatus);
    }
  } catch (err: any) {
    console.log('ERROR: ', err)
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}

export const updateAssessmentProgressTracker = async (req: any, res: any) => {
  const assessmentData = req.body;
  const user_id = assessmentData?.user_id;
  const assessment_type = assessmentData?.type;

  if (!assessmentData && !user_id) {
    return res.status(400).json({
      message: 'INVALID_REQUEST_BODY',
      code: 'BAD_REQUEST',
    });
  }
  let data: any = {
    last_assessment_date: new Date(),
  };
  if (assessment_type === 'onboarding') {
    data = {
      ...data,
      onboarding_assessment_completed: true,
    }
  }

  try {
    const response: any = await updateAssessmentProgressTrackerService(user_id, data);

    if (response && response.code) {
      console.error('ERROR: ', response)
      return res.status(response.statusCode || 400).json({
        message: response.message,
        code: response.code,
      });
    } else {
      return res.status(200).json(response.Attributes);
    }
  } catch (err: any) {
    console.error('ERROR: ', err)
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}