import axios from 'axios';

import { API_BASE_URL } from '../config/api';

export interface PredictionPayload {
    userId: number;
    matchId: string;
    predictedWinnerId: number;
}

export interface StoredPrediction {
    id: string;
    userId: number;
    matchId: string;
    predictedWinnerId: number;
    createdAt: string;
    updatedAt: string;
}

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 8000,
});

export const submitPrediction = async (payload: PredictionPayload) => {
    const response = await api.post('/predictions', payload);
    return response.data as {
        success: boolean;
        message: string;
        prediction: StoredPrediction;
    };
};

export const fetchUserPredictions = async (userId: number) => {
    const response = await api.get(`/predictions/user/${userId}`);
    return response.data as {
        success: boolean;
        predictions: StoredPrediction[];
    };
};
