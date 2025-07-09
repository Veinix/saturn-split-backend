import { configDotenv } from "dotenv";
configDotenv()

import fastifyCors from "@fastify/cors";
import fastify, { FastifyInstance } from "fastify";
import groupRoutes from "./1-routes/group-routes.js";
import auth from "@plugins/auth.js";
import db from "@plugins/db.js";
import authRoutes from "@routes/auth-routes.js";
import testRoutes from "@routes/test-routes.js";
const isProd = process.env.NODE_ENV === 'production';
const loggerOptions = isProd
    ? true                     // built-in JSON logger
    : {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss',
                ignore: 'pid,hostname', // optional: removes less relevant fields
            }
        }
    }
const app: FastifyInstance = fastify({
    logger: loggerOptions
})



const start = async () => {
    try {
        // * Registering Plugins
        // CORS
        
await app.register(fastifyCors, {
  origin: [
    'https://saturnsplit.app',            // Your production domain
    'https://www.saturnsplit.app',        // In case you have www
    'http://localhost:5173'               // Local dev
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
});


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
            port: Number(process.env.PORT) || 3000,
            host: "0.0.0.0"
        });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
