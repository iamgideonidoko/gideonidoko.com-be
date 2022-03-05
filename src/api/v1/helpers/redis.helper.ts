import redisClient from '../../../config/redis.config';
import constants from '../../../config/constants.config';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';

// flush redis db but retain tokens
export const flushRedis = (): Promise<void> => {
    return new Promise<void>(async (resolve) => {
        try {
            const refreshTokens = await redisClient.get(constants.refreshTokensRedisKey);
            await redisClient.flushDb();
            if (refreshTokens) {
                await redisClient.set(constants.refreshTokensRedisKey, refreshTokens, {
                    NX: true,
                });
                resolve();
            }
            resolve();
        } catch (err) {
            console.log('Redis Error => ', err);
            resolve();
        }
    });
};

export const removeExpiredRefreshTokens = (refreshTokenArr: string[]): string[] => {
    if (Array.isArray(refreshTokenArr)) {
        const arrWithoutExpiredTokens = refreshTokenArr.filter((token) => {
            const decoded: { exp: number } = jwt_decode(token);
            if (dayjs.unix(decoded?.exp as number).diff(dayjs()) < 1) {
                return false;
            }
            return true;
        });
        return arrWithoutExpiredTokens;
    } else {
        return [];
    }
};

// add refresh token
export const addRefreshTokenToCache = (refreshToken: string): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            // get existing refresh tokens (returned as stringified array)
            const refreshTokens = await redisClient.get(constants.refreshTokensRedisKey);
            // create a new array for refresh tokens
            if (refreshTokens) {
                // if refresh tokens are in db,parse and add new refresh token to it
                const refreshTokenArr: string[] = removeExpiredRefreshTokens(JSON.parse(refreshTokens));
                if (refreshTokenArr.indexOf(refreshToken) !== -1) {
                    // token exists in redis cache so overwrite
                    await redisClient.set(constants.refreshTokensRedisKey, JSON.stringify(refreshTokenArr), {
                        XX: true,
                    });
                } else {
                    await redisClient.set(
                        constants.refreshTokensRedisKey,
                        JSON.stringify([refreshToken, ...refreshTokenArr]),
                        {
                            XX: true,
                        },
                    );
                }
            } else {
                // create new array with new refresh token as only item
                await redisClient.set(constants.refreshTokensRedisKey, JSON.stringify([refreshToken]), {
                    NX: true,
                });
            }
            resolve();
        } catch (err) {
            reject(err);
        }
    });
};

// validate that refresh token exists in redis cache
export const validateRefreshToken = (refreshToken: string): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            // get existing refresh tokens (returned as stringified array)
            const refreshTokens = await redisClient.get(constants.refreshTokensRedisKey);
            if (refreshTokens) {
                const refreshTokenArr: string[] = removeExpiredRefreshTokens(JSON.parse(refreshTokens));
                if (refreshTokenArr.indexOf(refreshToken) !== -1) {
                    // refresh token has not expired and is still in the redis cache
                    resolve(true);
                } else {
                    // token does not exist in redis cache hence, invalid
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        } catch (err) {
            reject(err);
        }
    });
};
