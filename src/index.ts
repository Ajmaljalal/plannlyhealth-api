import express from 'express';
import morgan from 'morgan';
import config from './configs/base';
import companyRoutes from './routes/company';
import userRoutes from './routes/user';
import benefitsProgramsRoutes from './routes/benefits-programs';
import programBalanceRoutes from './routes/program-balances';
import claimsRoutes from './routes/claims';
import commentsRoutes from './routes/comments';
import dealsRoutes from './routes/deals';
import documentsRoutes from './routes/documents';

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


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


// Routes go here 
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/benefits-programs', benefitsProgramsRoutes);
app.use('/api/program-balances', programBalanceRoutes);
app.use('/api/claims', claimsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/documents', documentsRoutes);

// Error handling for any other routes that are not defined
app.use((req, res, next) => {
  const error = new Error('Sever is up and running, but the route you are trying to access is not defined.');
  res.status(404).json({
    message: error.message
  });
});


app.listen(config.server.port, () => {
  console.info(`Server listening on ${config.server.hostname}:${config.server.port}`)
});