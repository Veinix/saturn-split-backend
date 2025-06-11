import fastifyJwt from "@fastify/jwt";
import fp from 'fastify-plugin'


export default fp(async (fastify) => {
    fastify.register(fastifyJwt, {
        secret: process.env.JWT_SECRET!,
        sign: { expiresIn: '1h' },
    });

    // decorator to verify and populate request.user
    fastify.decorate(
        'authenticate',
        async (req, reply) => {
            try {
                await req.jwtVerify();
            } catch (err) {
                reply.send(err);
            }
        }
    );
});