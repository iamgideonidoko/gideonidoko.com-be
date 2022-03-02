import { createClient } from 'redis';
import constants from './constants.config';

const redisClient = createClient({
    url: constants.redisURI,
});

redisClient.on('error', (err) => console.log('Redis Client Error => ', err));
redisClient.on('connect', () => console.log('Connected to Redis...'));
redisClient.on('ready', () => console.log('Client connected to Redis and reday to use...'));
redisClient.on('end', () => console.log('Client disconnected from Redis...'));
redisClient.on('end', () => console.log('Client disconnected from Redis...'));
redisClient.on('SIGINT', () => redisClient.quit());

export default redisClient;
