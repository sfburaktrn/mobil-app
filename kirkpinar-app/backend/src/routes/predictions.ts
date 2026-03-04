import { FastifyInstance } from 'fastify';
import z from 'zod';
import { predictionQueue } from '../redis';

const predictionSchema = z.object({
    userId: z.number().int().positive(),
    matchId: z.number().int().positive(),
    predictedWinnerId: z.number().int().positive(),
});

export default async function predictionRoutes(app: FastifyInstance) {
    app.post(
        '/predict',
        {
            schema: {
                body: predictionSchema,
            },
        },
        async (request, reply) => {
            const data = request.body as z.infer<typeof predictionSchema>;

            // 1. Validate if the match is currently LIVE (fetch from Redis cache or fail-fast)
            // For now, assume it's valid and push to BullMQ queue instantly

            const job = await predictionQueue.add('new-prediction', {
                ...data,
                time: new Date().toISOString(),
            });

            // 2. Return success immediately so the client UI feels instantaneous
            return reply.code(202).send({
                success: true,
                message: 'Tahmininiz sıraya alındı!',
                jobId: job.id,
            });
        }
    );
}
