import Redis from 'ioredis';
import { Queue, Worker } from 'bullmq';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Main Redis connection for caching and leaderboards
export const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
});

// Setup Prediction Queue using BullMQ
export const predictionQueue = new Queue('predictions', {
    connection: redis as any,
});

// Optional: Background worker to process the queue asynchronously 
export const startWorker = () => {
    const worker = new Worker(
        'predictions',
        async (job) => {
            // In a real scenario, this is where we actually save to Postgres 
            // safely without overwhelming it.
            const { userId, matchId, predictedWinnerId, time } = job.data;
            console.log(`Processing prediction for User ${userId} on match ${matchId}`);
            // return prisma.prediction.create(...)
        },
        { connection: redis as any }
    );

    worker.on('completed', (job) => {
        console.log(`Job ${job.id} has completed!`);
    });

    worker.on('failed', (job, err) => {
        console.log(`Job ${job?.id} has failed with ${err.message}`);
    });
};
