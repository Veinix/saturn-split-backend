
import { RegisterBody, LoginBody } from "@app-types/auth.types.js";
import authService from "@services/auth-service.js";
import { FastifyReply, FastifyRequest } from 'fastify';


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
    return reply.status(201).send(result);
}

export async function login(
    request: FastifyRequest<{
        Body: LoginBody;
    }>,
    reply: FastifyReply
) {
    const result = await authService.loginUser(request.server.supabase, request.body);
    if (result.error) {
        return reply.status(401).send({ error: result.error.message });
    }
    return reply.send(result);
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