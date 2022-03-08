import createError from 'http-errors';
import User from '../models/user.model';
import { RegisterReturn } from '../interfaces/user.interface';
import { validatePassword } from '../helpers/password.helper';
import { signAccessToken, verifyRefreshToken, signRefreshToken } from '../helpers/jwt.helper';
import { addRefreshTokenToCache } from '../helpers/redis.helper';

export const getUserFromDb = async (username: string, userPassword: string): Promise<RegisterReturn> => {
    return new Promise<RegisterReturn>(async (resolve, reject) => {
        try {
            //Check for existing user in that model through password
            const user = await User.findOne({ username });
            if (!user) {
                reject(new createError.NotFound('User does not exist'));
            } else {
                const { id, name, username, email, password, githubusername } = user;

                const match = await validatePassword(userPassword, password);

                if (match) {
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
                            created_at: user.created_at as Date,
                        },
                    });
                } else {
                    reject(createError(401, 'Incorrect password'));
                }
            }
        } catch (err) {
            reject(err);
        }
    });
};

export const getNewTokens = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    return new Promise<{ accessToken: string; refreshToken: string }>(async (resolve, reject) => {
        try {
            // verify the refresh token to get the id of user
            const decoded = await verifyRefreshToken(refreshToken);
            const accessToken = await signAccessToken({ id: decoded?.id });
            const refToken = await signRefreshToken({ id: decoded?.id });
            await addRefreshTokenToCache(refToken);
            resolve({ accessToken, refreshToken: refToken });
        } catch (err) {
            reject(err);
        }
    });
};
