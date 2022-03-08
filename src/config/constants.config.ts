// require('dotenv').config();
import { config } from 'dotenv';
import { Secret } from 'jsonwebtoken';

config();

type Constants = {
    mongodbURI: string;
    redisURI: string;
    accessTokenSecret: Secret;
    refreshTokenSecret: Secret;
    commentsUpdateAccessKey: string;
    contactPostAccessKey: string;
    accessTokenSpan: number | string;
    refreshTokenSpan: number | string;
    v1Base: string;
    redisPassword: string;
    redisUsername: string;
    redisKeySpan: number;
    refreshTokensRedisKey: string;
    noAuthKey: string;
};

const constants: Constants = {
    mongodbURI: process.env.MONGODB_URI as string,
    redisURI: process.env.REDIS_URI as string,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as Secret,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as Secret,
    commentsUpdateAccessKey: process.env.COMMENTS_UPDATE_ACCESS_KEY as string,
    contactPostAccessKey: process.env.CONTACT_POST_ACCESS_KEY as string,
    accessTokenSpan: '1h',
    refreshTokenSpan: '2d',
    v1Base: '/api/v1',
    redisPassword: process.env.REDIS_PASSWORD as string,
    redisUsername: process.env.REDIS_USERNAME as string,
    redisKeySpan: 60 * 60 * 24 * 2, // 2 days
    refreshTokensRedisKey: 'refreshTokens',
    noAuthKey: process.env.NO_AUTH_KEY as string,
};

export default constants;
