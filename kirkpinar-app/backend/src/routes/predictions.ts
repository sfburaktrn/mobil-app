import { FastifyInstance } from 'fastify';
import z from 'zod';
import { getLeaderboard, getPredictionsByUser, upsertPrediction } from '../store/predictionStore';

const predictionSchema = z.object({
    userId: z.number().int().positive(),
    matchId: z.string().min(1),
    predictedWinnerId: z.number().int().positive(),
});

export default async function predictionRoutes(app: FastifyInstance) {
    app.get(
        '/leaderboard',
        async () => {
            return {
                success: true,
                leaderboard: getLeaderboard(),
            };
        }
    );

    app.get(
        '/user/:userId',
        {
            schema: {
                params: z.object({
                    userId: z.coerce.number().int().positive(),
                }),
            },
        },
        async (request) => {
            const params = request.params as { userId: number };

            return {
                success: true,
                predictions: getPredictionsByUser(params.userId),
            };
        }
    );

    app.post(
        '/',
        {
            schema: {
                body: predictionSchema,
            },
        },
        async (request, reply) => {
            const data = request.body as z.infer<typeof predictionSchema>;
            const prediction = upsertPrediction(data);

            return reply.code(202).send({
                success: true,
                message: 'Tahmininiz kaydedildi.',
                prediction,
            });
        }
    );
}
