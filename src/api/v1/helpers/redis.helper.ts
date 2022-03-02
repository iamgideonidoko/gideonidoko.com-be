import redisClient from '../../../config/redis.config';
import constants from '../../../config/constants.config';

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
