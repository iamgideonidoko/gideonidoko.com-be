import { Request } from 'express';

export interface LoggedInUserRequest extends Request {
    user?: {
        id: string;
    };
}

export interface LoginUser {
    username: string;
    password: string;
}

export interface RefreshToken {
    refreshToken: string;
}
