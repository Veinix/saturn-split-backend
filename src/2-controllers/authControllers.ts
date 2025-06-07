
import { FastifyReply, FastifyRequest } from 'fastify';
import authService from '../3-services/authService';

export async function register(
    request: FastifyRequest<{
        Body: { email: string; password: string };
    }>,
    reply: FastifyReply
) {
    const { email, password } = request.body;
    const result = await authService.register(request.server.supabase, email, password);
    if (result.error) {
        return reply.status(400).send({ error: result.error.message });
    }
    return reply.send({ user: result.user });
}

export async function login(
    request: FastifyRequest<{
        Body: { email: string; password: string };
    }>,
    reply: FastifyReply
) {
    const { email, password } = request.body;
    const result = await authService.login(request.server.supabase, email, password);
    if (result.error) {
        return reply.status(401).send({ error: result.error.message });
    }
    return reply.send({ session: result.session });
}

export async function logout(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const result = await authService.logout(request.server.supabase);
    if (result.error) {
        return reply.status(400).send({ error: result.error.message });
    }
    return reply.send({ success: true });
}