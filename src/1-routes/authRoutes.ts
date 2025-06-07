import { FastifyPluginAsync } from 'fastify';
import { login, logout, register } from '../2-controllers/authControllers';

const authRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post('/auth/register', register);
    fastify.post('/auth/login', login);
    fastify.post('/auth/logout', logout);
};

export default authRoutes;