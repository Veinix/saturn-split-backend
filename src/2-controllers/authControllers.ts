
import { FastifyReply, FastifyRequest } from 'fastify';
import authService from '../3-services/authService';
import { LoginBody, RegisterBody } from '../types/auth.types';

export async function register(
    request: FastifyRequest<{
        Body: RegisterBody;
    }>,
    reply: FastifyReply
) {
    const result = await authService.register(request.server.supabase, request.body);
    if (result.error) {
        return reply.status(400).send({ error: result.error.message });
    }
    return reply.send(result);
}

export async function login(
    request: FastifyRequest<{
        Body: LoginBody;
    }>,
    reply: FastifyReply
) {
    const { username, password } = request.body;
    const result = await authService.login(request.server.supabase, username, password);
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