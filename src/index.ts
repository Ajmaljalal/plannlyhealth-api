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


app.listen(config.server.port, () => {
  console.info(`Server listening on ${config.server.hostname}:${config.server.port}`)
});