import jwt, { JwtPayload } from 'jsonwebtoken';
import constants from '../../../config/constants.config';
import { getRedisClient } from '../../../config/redis.config';
import createError from 'http-errors';

const client = getRedisClient();

interface JwtCustomPayload {
    id: string;
}

/*  */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signAccessToken = async (payload: JwtCustomPayload): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(payload, constants.accessTokenSecret, { expiresIn: constants.accessTokenSpan }, (err, token) => {
            if (err) reject(err);
            resolve(token as string);
        });
    });
};

export const signRefreshToken = async (payload: JwtCustomPayload): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(
            payload,
            constants.refreshTokenSecret,
            { expiresIn: constants.accessTokenSpan },
            async (err, token) => {
                if (err) reject(err);
                try {
                    await client.set(payload.id, token as string, {
                        EX: 365 * 24 * 60 * 60,
                    });
                    resolve(token as string);
                } catch (err) {
                    reject(err);
                }
            },
        );
    });
};

export const verifyAccessToken = async (accessToken: string): Promise<string | JwtPayload> => {
    return new Promise<string | JwtPayload>((resolve, reject) => {
        jwt.verify(accessToken, constants.accessTokenSecret, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded as JwtPayload | string);
        });
    });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const verifyRefreshToken = async (refreshToken: string): Promise<any> => {
    return new Promise<string | JwtPayload | undefined>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jwt.verify(refreshToken, constants.refreshTokenSecret, async (err, decoded: any) => {
            if (err) return reject(err);
            try {
                const value = await client.get(decoded?.id);
                if (refreshToken === value) return resolve(decoded);
                reject(new createError.Unauthorized());
            } catch (err) {
                reject(err);
            }
            resolve(decoded);
        });
    });
};
