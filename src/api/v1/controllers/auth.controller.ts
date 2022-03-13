import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { getNewTokens, getUserFromDb } from '../services/auth.service';
import { createSuccess } from '../helpers/http.helper';
import User from '../models/user.model';
import { LoggedInUserRequest } from '../interfaces/auth.interface';
import { validateRefreshToken } from '../helpers/redis.helper';

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    //check if all input fields have value
    if (!username || !password) {
        return next(createError(400, 'Please, enter all fields'));
        // return createSuccess(res, 200, 'User created');
    }

    try {
        const loggedInUser = await getUserFromDb(username, password);
        if (loggedInUser) {
            return createSuccess(res, 200, 'User logged in successfully', { user: loggedInUser });
        }
    } catch (err) {
        return next(err);
    }
};

export const refreshUserToken = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    //check if all input fields have value
    if (!refreshToken) {
        return next(createError(400, 'Please, enter all fields'));
    }

    try {
        const isValid = await validateRefreshToken(refreshToken);
        if (!isValid) return next(new createError.Unauthorized());
        const tokens = await getNewTokens(refreshToken);
        if (tokens) {
            return createSuccess(res, 200, 'Token refreshed successfully', { tokens });
        }
    } catch (err) {
        return next(err);
    }
};

export const getLoggedInUser = async (req: LoggedInUserRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user?.id).select('-password'); //removes the password from the selection
        if (user) {
            return createSuccess(res, 200, 'User fetched successfully', user);
        }
    } catch (err) {
        return next(err);
    }
};
