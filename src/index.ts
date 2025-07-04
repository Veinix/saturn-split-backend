import { configDotenv } from "dotenv";
configDotenv()

import fastifyCors from "@fastify/cors";
import fastify, { FastifyInstance } from "fastify";
import groupRoutes from "./1-routes/group-routes";
import authRoutes from "./1-routes/auth-routes";
import db from "./plugins/db";
import testRoutes from "./1-routes/test-routes";
import auth from "./plugins/auth";

const app: FastifyInstance = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss',
                ignore: 'pid,hostname', // optional: removes less relevant fields
            }
        }
    }
})

const BACKEND_PORT = process.env.BACKEND_PORT
const BACKEND_HOST = process.env.BACKEND_HOST

const start = async () => {
    try {
        // * Registering Plugins
        // CORS
        await app.register(fastifyCors, { origin: "*" });

        // Authentication
        await app.register(auth)

        // Database
        await app.register(db);

        // Routes
        await app.register(authRoutes, { prefix: "/api" })
        await app.register(groupRoutes, { prefix: "/api" });
        await app.register(testRoutes);

        // Initialize
        await app.listen({
            port: parseInt(process.env.BACKEND_PORT as string),
            host: process.env.BACKEND_HOST
        });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
