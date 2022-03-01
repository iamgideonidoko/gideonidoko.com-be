import express, { Request, Response, NextFunction, Application } from 'express';
import createError from 'http-errors';
import { config } from 'dotenv';
import morgan from 'morgan';
import xss from 'xss-clean';
import globalErrorHandler from './api/v1/middlewares/globalErrorHandler.middleware';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import limiter from './config/rateLimiter.config';
import appCors from './config/cors.config';
import mongoose from 'mongoose';
import constants from './config/constants.config';
import client from './config/redis.config';
// Routes Import
import userRoute from './api/v1/routes/user.route';
import authRoute from './api/v1/routes/auth.route';
import postRoute from './api/v1/routes/post.route';
import assetRoute from './api/v1/routes/asset.route';
import contactRoute from './api/v1/routes/contact.route';

// console.log('Client => ', client);

config();

// boostrap the express application
const app: Application = express();

// for development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//  limit request payload size
app.use(express.json({ limit: '1MB' }));

app.use(express.urlencoded({ extended: false }));

// sanitize data against XSS
app.use(xss());

// compress stuff sent to the client
app.use(compression());

// parse cookies
app.use(cookieParser());

// add secure HTTP headers
app.use(helmet());

// register rate limiter
app.use(limiter());

// cors
app.use(appCors());

/* 
@description    Connection to redis cache
*/
(async () => {
    // connect to redis
    try {
        await client.connect();
    } catch (err) {
        console.log('REDIS CONNECTION ERROR: ', err);
    }
})();

/* 
@description    MongoDB Connection using Mongoose ORM
*/
(async () => {
    try {
        await mongoose.connect(constants.mongodbURI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.log('MONGODB CONNECTION ERROR: ' + err);
    }
})();

// Routes
app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
        name: 'Gideon Idoko website Core',
        description: 'Core service for Gideon Idoko Website.',
    });
});

app.get(constants.v1Base, (_req: Request, res: Response) => {
    res.status(200).json({
        name: 'Gideon Idoko Website Core v1',
        description: 'Core service (v1) for Gideon Idoko website',
        version: 'v1',
    });
});

//use ROUTES
app.use(constants.v1Base, userRoute);
app.use(constants.v1Base, authRoute);
app.use(constants.v1Base, postRoute);
app.use(constants.v1Base, assetRoute);
app.use(constants.v1Base, contactRoute);

// Error for unhandled routes
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new createError.NotFound());
});

// middleware for global error handling
app.use(globalErrorHandler);

// get the unhandled rejection and throw it to another fallback handler we already have.
process.on('unhandledRejection', (reason: Error) => {
    throw reason;
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
process.on('uncaughtException', (error: Error) => {
    console.log('UncaughtException Error => ', error);
    process.exit(1);
});

const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));

/* http://gideonidokowebsitebckendapihst.herokuapp.com/ */
