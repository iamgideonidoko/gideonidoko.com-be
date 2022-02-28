import { createClient } from 'redis';
import constants from './constants.config';

const client = createClient({
    url: constants.redisURI,
});

client.on('error', (err) => console.log('Redis Client Error => ', err));
client.on('connect', () => console.log('Connected to Redis...'));
client.on('ready', () => console.log('Client connected to Redis and reday to use...'));
client.on('end', () => console.log('Client disconnected from Redis...'));
client.on('end', () => console.log('Client disconnected from Redis...'));
client.on('SIGINT', () => client.quit());

export default client;
