import { SupabaseClient } from '@supabase/supabase-js';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { JWTPayload, RegisterBody } from '../types/auth.types';
import { hash } from 'argon2';
import { Database } from '../types/database.types';
import jwtUtilities from "../5-utilities/jwtUtilitites";

class AuthService {

    async register(
        supabase: SupabaseClient<Database>,
        body: RegisterBody
    ): Promise<{ token?: string; error?: Error }> {
        const hashedPassword = await hash(body.password);

        const { data: privData, error: privErr } = await supabase
            .from("private_user_details")
            .insert({
                full_name: body.full_name,
                hashed_password: hashedPassword,
                phone_number: body.phone_number ?? null,
            })
            .select("user_id")
            .single();

        if (privErr || !privData) {
            return { error: privErr ?? new Error("Failed to insert private details") };
        }

        const userId = privData.user_id;

        const { error: pubErr } = await supabase
            .from("public_users")
            .insert({
                id: userId,
                username: body.username,
                favorite_color: body.favorite_color ?? null,
                role: body.role ?? "user",

            });

        if (pubErr) return { error: pubErr };

        // Create the JWT payload & sign
        const nowSec = Math.floor(Date.now() / 1000);
        const payload: JWTPayload = {
            userData: {
                partialName: body.full_name?.split(" ")[0] ?? "",
                role: body.role ?? "user",
                userId: userId,
                username: body.username,
                favoriteColor: body.favorite_color ?? "orange",
            },
            iat: nowSec,
            exp: nowSec + 60 * 60,   // 1 hour
        };

        const token = jwtUtilities.sign(payload)
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