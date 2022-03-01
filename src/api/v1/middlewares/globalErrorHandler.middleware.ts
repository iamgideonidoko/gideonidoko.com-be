import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import logger from '../../../config/logger.config';

// Error handler for development environment
const handleDevError: ErrorRequestHandler = (err, _req: Request, res: Response) => {
    logger.error({
        message: `[globalErrorHandler.middleware.ts] (line 7) - ${err.message}`,
    });

    return res.status(err.statusCode).json({
        ...err,
        message: err.message,
    });
};

// Error handler for Production Environment
const handleProdError: ErrorRequestHandler = (err, req: Request, res: Response) => {
    if (req.originalUrl.startsWith('/api/v1')) {
        // Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }

        // Programming or other unknown error: don't leak error details
        // 1) Log error
        logger.error(`[globalErrorHandler.middleware.ts] (line 31) - ${err.message}`);

        // 2) Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }

    // Programming or other unknown error: don't leak error details
    // 1) Log error
    logger.error(`[globalErrorHandler.middleware.ts] (line 42) - ${err.message}`);
};

const globalErrorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = `${err.statusCode}`.startsWith('4') ? 'fail' : 'error';

    // the node environment has to be declared
    if (process.env.NODE_ENV === 'development') {
        handleDevError(err, req, res, next);
    } else if (process.env.NODE_ENV === 'production') {
        const error = {
            ...err,
        };

        error.message = err.message;

        handleProdError(error, req, res, next);
    }
};

export default globalErrorHandler;
