export interface StoredPrediction {
    id: string;
    userId: number;
    matchId: string;
    predictedWinnerId: number;
    createdAt: string;
    updatedAt: string;
}

const predictions = new Map<string, StoredPrediction>();

const keyFor = (userId: number, matchId: string) => `${userId}:${matchId}`;

export const upsertPrediction = (input: {
    userId: number;
    matchId: string;
    predictedWinnerId: number;
}) => {
    const now = new Date().toISOString();
    const key = keyFor(input.userId, input.matchId);
    const existing = predictions.get(key);

    const prediction: StoredPrediction = existing
        ? {
            ...existing,
            predictedWinnerId: input.predictedWinnerId,
            updatedAt: now,
        }
        : {
            id: `prediction-${predictions.size + 1}`,
            userId: input.userId,
            matchId: input.matchId,
            predictedWinnerId: input.predictedWinnerId,
            createdAt: now,
            updatedAt: now,
        };

    predictions.set(key, prediction);

    return prediction;
};

export const getPredictionsByUser = (userId: number) => {
    return Array.from(predictions.values())
        .filter((prediction) => prediction.userId === userId)
        .sort((a, b) => a.matchId.localeCompare(b.matchId));
};

export const getLeaderboard = () => {
    const grouped = new Map<number, { userId: number; totalPredictions: number; updatedAt: string }>();

    for (const prediction of predictions.values()) {
        const current = grouped.get(prediction.userId);
        if (!current) {
            grouped.set(prediction.userId, {
                userId: prediction.userId,
                totalPredictions: 1,
                updatedAt: prediction.updatedAt,
            });
            continue;
        }

        current.totalPredictions += 1;
        if (prediction.updatedAt > current.updatedAt) {
            current.updatedAt = prediction.updatedAt;
        }
    }

    return Array.from(grouped.values()).sort((a, b) => {
        if (b.totalPredictions !== a.totalPredictions) {
            return b.totalPredictions - a.totalPredictions;
        }

        return a.updatedAt.localeCompare(b.updatedAt);
    });
};
