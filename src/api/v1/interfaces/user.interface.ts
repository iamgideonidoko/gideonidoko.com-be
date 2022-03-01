import { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    githubusername: string;
    created_at: Date;
}

export interface NewUser {
    name: string;
    username: string;
    email: string;
    password: string;
    retype_password: string;
    githubusername: string;
}

export interface RegisterReturn {
    accessToken: string | undefined;
    refreshToken: string | undefined;
    user: {
        id: string;
        name: string;
        username: string;
        email: string;
        githubusername: string;
        created_at: Date;
    };
}
