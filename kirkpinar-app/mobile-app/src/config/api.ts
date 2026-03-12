import { Platform } from 'react-native';

const LAN_IP = '192.168.0.159';

export const API_BASE_URL = Platform.select({
    web: 'http://localhost:3000/api',
    default: `http://${LAN_IP}:3000/api`,
});

export const DEMO_USER_ID = 1;
