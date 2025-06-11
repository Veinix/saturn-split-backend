import { SupabaseClient } from '@supabase/supabase-js';
import type { User, Session, AuthApiError, AuthError } from '@supabase/supabase-js';
import { RegisterBody } from '../types/auth.types';
import { hash } from 'argon2';
import { Database } from '../types/database.types';
import jwt, { fastifyJwt } from '@fastify/jwt';
class AuthService {

    async register(
        supabase: SupabaseClient<Database>,
        body: RegisterBody
    ): Promise<{ token?: string; error?: Error }> {
        // 1️⃣ Hash the password
        const hashedPassword = await hash(body.password);

        // 2️⃣ Insert into private_user_details
        const { data: priv, error: privErr } = await supabase
            .from("private_user_details")
            .insert({
                full_name: body.full_name,
                hashed_password: hashedPassword,
                phone_number: body.phone_number ?? null,
                role: body.role ?? "user",
            })
            .select("user_id")
            .single();

        if (privErr || !priv) {
            return { error: privErr ?? new Error("Failed to insert private details") };
        }

        const userId = priv.user_id;

        const { error: pubErr } = await supabase
            .from("public_users")
            .insert({
                id: userId,
                username: body.username,
                favorite_color: body.favorite_color ?? null,
            });

        if (pubErr) return { error: pubErr };

        // Create the JWT payload & sign
        const nowSec = Math.floor(Date.now() / 1000);
        const payload = {
            sub: userId,
            role: body.role ?? "user",
            username: body.username,
            iat: nowSec,
            exp: nowSec + 60 * 60,   // 1 hour
        };

        // const token = fastifyJwt.si
        return { token };
    }

    async login(
        supabase: SupabaseClient,
        email: string,
        password: string
    ): Promise<{ user: User | null; session: Session | null; error: AuthError | null }> {
        // Using v2 password signin method
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        return {
            user: data?.user ?? null,

            session: data?.session ?? null,
            error,
        };
    }

    async logout(
        supabase: SupabaseClient
    ): Promise<{ error: AuthError | null }> {
        const { error } = await supabase.auth.signOut();
        return { error };
    }

    async getSession(
        supabase: SupabaseClient
    ): Promise<Session | null> {
        const { data } = await supabase.auth.getSession();
        return data.session;
    }

    async getAccessToken(
        supabase: SupabaseClient,
    ) {
        const session = await this.getSession(supabase);
        return session?.access_token || null;
    }

    async getCurrentUser(
        supabase: SupabaseClient,
    ): Promise<User | null> {
        const { data } = await supabase.auth.getUser();
        return data.user;
    }

}

const authService = new AuthService();
export default authService;