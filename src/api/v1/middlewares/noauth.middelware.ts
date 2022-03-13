import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import constants from '../../../config/constants.config';

// to make use of the isBetween plugin (register the isBetween pluging)
dayjs.extend(isBetween);

const noauth = (req: Request, _res: Response, next: NextFunction): void => {
    // get the token from the request header

    // return next();

    const noAuthKey = req.header('x-auth-api-key');

    if (!noAuthKey) return next(new createError.Unauthorized());

    const timestamp = Number((noAuthKey as string).replace(`${constants.noAuthKey}`, ''));

    if (!timestamp) return next(new createError.Unauthorized());

    const isValid = dayjs(timestamp).isBetween(dayjs().subtract(10, 'second'), dayjs());

    if (!isValid) return next(new createError.Unauthorized());

    return next();
};

export default noauth;
