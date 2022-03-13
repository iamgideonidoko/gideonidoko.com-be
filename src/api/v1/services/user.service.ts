import createError from 'http-errors';
import User from '../models/user.model';
import { NewUser, RegisterReturn } from '../interfaces/user.interface';
import { hashPassword } from '../helpers/password.helper';
import { signAccessToken, signRefreshToken } from '../helpers/jwt.helper';
import { addRefreshTokenToCache } from '../helpers/redis.helper';

export const addUserToDb = async (payload: NewUser): Promise<RegisterReturn> => {
    return new Promise<RegisterReturn>(async (resolve, reject) => {
        try {
            const user = await User.findOne({ $or: [{ email: payload.email }, { username: payload.username }] });
            if (user) {
                reject(createError(406, 'User already exists'));
            } else {
                //create new user from the model
                const newUser = new User({
                    name: payload.name,
                    username: payload.username,
                    email: payload.email,
                    password: payload.password,
                    githubusername: payload.username,
                });
                // hash user password
                const hashedPassword = await hashPassword(newUser.password);
                // overwrite initial password with hashed password
                newUser.password = hashedPassword;
                // save new user to the db
                const savedUser = await newUser.save();
                const { id, name, username, email, githubusername, created_at } = savedUser;
                // sign a new access token for the user using their id
                const accessToken = await signAccessToken({ id });
                const refreshToken = await signRefreshToken({ id });
                await addRefreshTokenToCache(refreshToken);
                resolve({
                    accessToken,
                    refreshToken,
                    user: {
                        id,
                        name,
                        username,
                        email,
                        githubusername,
                        created_at,
                    },
                });
            }
        } catch (err) {
            reject(err);
        }
    });
};
