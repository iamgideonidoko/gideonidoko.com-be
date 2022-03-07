import createError from 'http-errors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import constants from '../../../config/constants.config';

interface AuthReq extends Request {
    user?: string | JwtPayload;
}

const auth = (req: AuthReq, _res: Response, next: NextFunction): void => {
    // get the token from the request header

    const bearerToken = req.header('Authorization');

    // check if token is available
    if (!bearerToken) return next(createError(401, 'Auth token is invalid or not provided'));
    const bearer = bearerToken.split(' ')[0];
    const token = bearerToken.split(' ')[1];

    if (bearer.trim() !== 'Bearer' || !token) return next(createError(401, 'Auth token is invalid or not provided'));

    try {
        //if there is a token, then verify
        const decoded = jwt.verify(token, constants.accessTokenSecret);

        //add the user from payload
        req.user = decoded; // decoded value should be something like { id }

        next();
    } catch (e) {
        return next(createError(401, 'Auth token is invalid or not provided'));
    }
};

export default auth;
