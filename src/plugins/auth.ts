import { configDotenv } from "dotenv";
configDotenv()
import { FastifyPluginAsync, FastifyRequest, FastifyReply, preHandlerHookHandler } from 'fastify'
import fp from 'fastify-plugin'
import authService from "../3-services/authService";
import jwtUtilities from "../5-utilities/jwtUtilitites";

// 1️⃣ Tell TS about request.user
declare module 'fastify' {
    interface FastifyRequest {
        userId: string
    }

    // 2️⃣ Tell TS about fastify.authenticate
    interface FastifyInstance {
        authenticate: preHandlerHookHandler
    }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {

    fastify.decorate(
        'authenticate',
        async (request: FastifyRequest, reply: FastifyReply) => {
            const auth = request.headers.authorization
            if (!auth?.startsWith('Bearer ')) {
                return reply.status(401).send({ message: 'Missing bearer token' })
            }
            const token = auth.slice(7)
            const verified = jwtUtilities.verify(token)
            console.log("Verified", verified)
            if (!verified) return reply.status(401).send({ message: 'Invalid or expired token' })

            const data = await authService.getUserByToken(fastify.supabase, token)
            if (!data) return reply.status(401).send({ message: 'Invalid or expired token' })

            request.userId = data.id
        }
    )
}

export default fp(authPlugin, {
    name: 'authPlugin',
})
