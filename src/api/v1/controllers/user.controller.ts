import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { addUserToDb } from '../services/user.service';
import { createSuccess } from '../helpers/http.helper';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, username, email, password, retype_password, githubusername } = req.body;

    //check if all input fields have value
    if (!name || !username || !email || !password || !retype_password || !githubusername) {
        return next(createError(400, 'Please, enter all fields'));
        // return createSuccess(res, 200, 'User created');
    }

    if (password !== retype_password) {
        return next(createError(400, 'Passwords must be same'));
    }

    try {
        const registeredUser = await addUserToDb(req.body);
        if (registeredUser) {
            return createSuccess(res, 200, 'User registered successfully', { user: registeredUser });
        }
    } catch (err) {
        return next(err);
    }
};
