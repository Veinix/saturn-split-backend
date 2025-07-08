import { configDotenv } from "dotenv";
configDotenv()
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { createRequire } from 'module'
import { FastifyPluginAsync } from "fastify";
const require = createRequire(import.meta.url)
// now require the plugin as a CJS module
const fp = require('fastify-plugin') as (
    plugin: FastifyPluginAsync,
    opts?: { name?: string; fastify?: string }
) => FastifyPluginAsync

declare module 'fastify' {
    interface FastifyInstance {
        supabase: SupabaseClient;
    }
}

export default fp(async (fastify) => {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    fastify.decorate('supabase', supabase);
});