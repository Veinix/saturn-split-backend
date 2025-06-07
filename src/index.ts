import { configDotenv } from "dotenv";
configDotenv()
import fastifyCors from "@fastify/cors";
import fastify, { FastifyInstance } from "fastify";
import groupRoutes from "./1-routes/groupRoutes";
import testRoutes from "./1-routes/testRoutes";
import auth from "./plugins/auth";
import authRoutes from "./1-routes/authRoutes";

const app: FastifyInstance = fastify({
    logger: true
})

const start = async () => {
    try {
        // * Registering Plugins
        // CORS
        await app.register(fastifyCors, { origin: "*" });
        
        // Auth
        await app.register(auth);

        // Routes
        await app.register(authRoutes, { prefix: "/api" })
        await app.register(groupRoutes, { prefix: "/api" });
        await app.register(testRoutes)

        // Initialize
        await app.listen({ port: 3000 });
        console.log("Server running on http://localhost:3000");
    } catch (err) {
        console.error(err)
        process.exit(1);
    }
};

start();
