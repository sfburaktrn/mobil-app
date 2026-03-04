import { buildApp } from './app';

const start = async () => {
    const app = await buildApp();
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

    try {
        await app.listen({ port, host: '0.0.0.0' });
        console.log(`🚀 Sunucu ${port} portunda başlatıldı`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
