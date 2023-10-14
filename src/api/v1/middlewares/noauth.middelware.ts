import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import constants from '../../../config/constants.config';

const noauth = (req: Request, _res: Response, next: NextFunction): void => {
    // Get the token from the request header
    const noAuthKey = req.header('x-auth-api-key');

    const isValid = noAuthKey === constants.noAuthKey;

    if (!isValid) return next(new createError.Unauthorized());

    return next();
};

export default noauth;
