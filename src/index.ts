import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import config from './configs/base';
import { authenticationMiddleware } from './middlewares/authenticate';
import companyRoutes from './routes/company';
import employeeRoutes from './routes/employee';
import documentsRoutes from './routes/documents';
import newUsersRoutes from './routes/invited-user';
import authRoutes from './routes/auth';
import stripeRoutes from './routes/stripe';
import sendGridRoutes from './routes/sendgrid';
import assessmentsRoutes from './routes/assessments';
import riskProfileRoutes from './routes/risk-profiles';
import { generateComprehensiveRiskProfile } from './lib/helpers';

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


// Rules for the Plannly API 
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// Routes that do not require authentication
app.use('/auth', authRoutes)

// Middleware for authentication
app.use(authenticationMiddleware);
// Routes go here 
app.use('/employees', employeeRoutes);
app.use('/companies', companyRoutes);
app.use('/documents', documentsRoutes);
app.use('/new-users', newUsersRoutes)
app.use('/stripe', stripeRoutes)
app.use('/sendgrid', sendGridRoutes)
app.use('/assessments', assessmentsRoutes)
app.use('/risk-profiles', riskProfileRoutes)

app.use('/', (req, res) => {
  res.status(200).json('OK');
});

// Error handling for any other routes that are not defined
app.use((req, res, next) => {
  const error = new Error('This route does not exist');
  res.status(404).json({
    message: error.message,
    code: 'NOT_FOUND'
  });
});

// const assessment: any = {
//   type: 'monthly',
//   user_id: 'bcdfe15d-682b-4838-a950-964f1198c5ea',
//   user_job_title: 'CTO',
//   company_id: '2b1a967e-2132-4826-a829-843882016b8c',
//   is_completed: true,
//   answers: [
//     {
//       id: 1,
//       question_id: 'burnout_1',
//       question: 'How frequently do you feel exhausted after work?',
//       options: ['Never', 'Occasionally', 'Sometimes', 'Often', 'Always'],
//       scores: { Never: 0, Occasionally: 2, Sometimes: 3, Often: 4, Always: 5 },
//       category: 'burnout',
//       selected_option: 'Sometimes'
//     },
//     {
//       id: 2,
//       question_id: 'workload_2',
//       question: 'Do you have enough time to complete your tasks?',
//       options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'],
//       scores: { Always: 0, Often: 1, Sometimes: 3, Rarely: 4, Never: 5 },
//       category: 'workload',
//       selected_option: 'Rarely'
//     },
//     {
//       id: 3,
//       question_id: 'turnover_1',
//       question: 'How likely are you to leave your job in the next 6 months?',
//       options: [
//         'Very unlikely',
//         'Unlikely',
//         'Neutral',
//         'Likely',
//         'Very likely'
//       ],
//       scores: {
//         'Very unlikely': 0,
//         Unlikely: 1,
//         Neutral: 3,
//         Likely: 4,
//         'Very likely': 5
//       },
//       category: 'turnover',
//       selected_option: 'Very unlikely'
//     },
//     {
//       id: 4,
//       question_id: 'resources_1',
//       question: 'Do you have the resources you need to do your job effectively?',
//       options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'],
//       scores: { Always: 0, Often: 1, Sometimes: 3, Rarely: 4, Never: 5 },
//       category: 'resources',
//       selected_option: 'Often'
//     },
//     {
//       id: 5,
//       question_id: 'burnout_2',
//       question: 'How frequently do you feel overwhelmed by your work?',
//       options: ['Never', 'Occasionally', 'Sometimes', 'Often', 'Always'],
//       scores: { Never: 0, Occasionally: 2, Sometimes: 3, Often: 4, Always: 5 },
//       category: 'burnout',
//       selected_option: 'Often'
//     },
//     {
//       id: 6,
//       question_id: 'workload_3',
//       question: 'How frequently do you find yourself working overtime?',
//       options: ['Never', 'Occasionally', 'Sometimes', 'Often', 'Always'],
//       scores: { Never: 0, Occasionally: 1, Sometimes: 2, Often: 4, Always: 5 },
//       category: 'workload',
//       selected_option: 'Sometimes'
//     },
//     {
//       id: 7,
//       question_id: 'turnover_3',
//       question: 'Are you satisfied with your current job?',
//       options: [
//         'Very satisfied',
//         'Satisfied',
//         'Neutral',
//         'Dissatisfied',
//         'Very dissatisfied'
//       ],
//       scores: {
//         'Very satisfied': 0,
//         Satisfied: 1,
//         Neutral: 3,
//         Dissatisfied: 4,
//         'Very dissatisfied': 5
//       },
//       category: 'turnover',
//       selected_option: 'Very satisfied'
//     }
//   ],
//   id: '44b63dbc-2770-4849-81d8-cafd6b4b96fb',
//   created_at: 'Thu Nov 02 2023 11:25:02 GMT-0700 (Pacific Daylight Time)',
//   modified_at: 'Thu Nov 02 2023 11:25:02 GMT-0700 (Pacific Daylight Time)',
//   risk_scores: {
//     burnout: { score: 7, symptoms_count: 2, percentage: 70 },
//     turnover: { score: 0, symptoms_count: 2, percentage: 0 },
//     workload: { score: 6, symptoms_count: 2, percentage: 60 },
//     resources: { score: 1, symptoms_count: 1, percentage: 20 }
//   }
// }

// const riskProfile = generateComprehensiveRiskProfile(assessment)

// console.dir(riskProfile, { depth: 4 })


app.listen(config.server.port, () => {
  console.info(`Server listening on ${config.server.hostname}:${config.server.port}`)
});