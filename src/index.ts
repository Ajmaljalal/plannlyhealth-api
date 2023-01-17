import express from 'express';
import morgan from 'morgan';
import config from './configs/base';
import userRoutes from './routes/user';

const NAMESPACE = 'Server';
const app = express();

// Log the request 
app.use(morgan('dev'));

// Parse the body of the request 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Rules of our API 
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

// Error handling for any other routes that are not defined
app.use((req, res, next) => {
    const error = new Error('Not found');
    res.status(404).json({
        message: error.message
    });
});


app.listen(config.server.port, () => {console.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`)});