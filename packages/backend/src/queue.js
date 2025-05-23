import { Queue } from 'bullmq';

// Redis connection (same host/port as in docker-compose)
export const connection = { host: 'localhost', port: 6379 };

// Named queue for content-generation jobs
export const contentQueue = new Queue('content', { connection });
