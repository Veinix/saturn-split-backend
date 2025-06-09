import { configDotenv } from "dotenv";
configDotenv()

import fp from 'fastify-plugin';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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