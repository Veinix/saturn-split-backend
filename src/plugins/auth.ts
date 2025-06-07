// src/plugins/auth.ts
import { FastifyPluginAsync, FastifyRequest, FastifyReply, preHandlerHookHandler } from 'fastify'
import fp from 'fastify-plugin'
import { createClient } from '@supabase/supabase-js'

// 1️⃣ Tell TS about request.user
declare module 'fastify' {
    interface FastifyRequest {
        user: {
            id: string
            email?: string
            [key: string]: any
        }
    }

    // 2️⃣ Tell TS about fastify.authenticate
    interface FastifyInstance {
        authenticate: preHandlerHookHandler
    }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
    // Initialize Supabase Admin client
    const supabaseAdmin = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 3️⃣ Decorate the instance with our preHandler
    fastify.decorate(
        'authenticate',
        // Note: signature matches Fastify's `preHandler` hook
        async (request: FastifyRequest, reply: FastifyReply) => {
            const auth = request.headers.authorization
            if (!auth?.startsWith('Bearer ')) {
                return reply.status(401).send({ message: 'Missing bearer token' })
            }

            const token = auth.slice(7)
            const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

            if (error || !user) {
                return reply.status(401).send({ message: 'Invalid or expired token' })
            }

            request.user = user
        }
    )
}

export default fp(authPlugin, {
    // ensure this plugin runs before routes try to use `authenticate`
    name: 'authPlugin',
})
