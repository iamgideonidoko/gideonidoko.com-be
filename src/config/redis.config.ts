import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => console.log('Redis Client Error => ', err));
client.on('connect', () => console.log('Connected to Redis...'));
client.on('ready', () => console.log('Client connected to Redis and reday to use...'));
client.on('end', () => console.log('Client disconnected from Redis...'));
client.on('end', () => console.log('Client disconnected from Redis...'));
client.on('SIGINT', () => client.quit());

const connectRedisClient = async (): Promise<unknown> => {
    await client.connect();

    return client;
};

export const getRedisClient = () => client;

export default connectRedisClient;
