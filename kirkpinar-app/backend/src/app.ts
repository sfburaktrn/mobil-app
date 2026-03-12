import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import { validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod'
import predictionRoutes from './routes/predictions'

export const buildApp = async () => {
    const app = Fastify({
        logger: true
    })

    // Security headers & CORS
    await app.register(helmet)
    await app.register(cors, {
        origin: '*', // Adjust for production
    })

    // Set up Zod validation compilers
    app.setValidatorCompiler(validatorCompiler)
    app.setSerializerCompiler(serializerCompiler)

    // A simple health check route
    app.get('/health', async () => {
        return { status: 'ok', timestamp: new Date() }
    })

    await app.register(predictionRoutes, {
        prefix: '/api/predictions',
    })

    return app
}
