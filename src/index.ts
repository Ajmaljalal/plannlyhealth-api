import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import config from './configs/base';
import { authenticationMiddleware } from './middlewares/authenticate';
import companyRoutes from './routes/company';
import userRoutes from './routes/user';
import benefitsProgramsRoutes from './routes/benefits-programs';
import programBalanceRoutes from './routes/program-balances';
import claimsRoutes from './routes/claims';
import commentsRoutes from './routes/comments';
import dealsRoutes from './routes/deals';
import documentsRoutes from './routes/documents';
import newUsersRoutes from './routes/new-users';
import authRoutes from './routes/auth';
import stripeRoutes from './routes/stripe';
import sendGridRoutes from './routes/sendgrid';

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
app.use('/health', (req, res) => {
  res.status(200).json('OK');
});

app.use('/auth', authRoutes)


// Middleware for authentication
app.use(authenticationMiddleware);
// Routes go here 
app.use('/users', userRoutes);
app.use('/companies', companyRoutes);
app.use('/benefits-programs', benefitsProgramsRoutes);
app.use('/program-balances', programBalanceRoutes);
app.use('/claims', claimsRoutes);
app.use('/comments', commentsRoutes);
app.use('/deals', dealsRoutes);
app.use('/documents', documentsRoutes);
app.use('/new-users', newUsersRoutes)
app.use('/stripe', stripeRoutes)
app.use('/sendgrid', sendGridRoutes)

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