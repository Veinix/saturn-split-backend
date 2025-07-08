import { login, logout, register } from "@controllers/auth-controller.js";
import { FastifyPluginAsync } from 'fastify';

const authRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post('/auth/register', register);

    fastify.post('/auth/login', login);

    fastify.post('/auth/logout', logout);
};

export default authRoutes;