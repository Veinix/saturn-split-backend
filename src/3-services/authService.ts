import { SupabaseClient } from '@supabase/supabase-js';
import type { User, Session, AuthApiError, AuthError } from '@supabase/supabase-js';
class AuthService {

    /**
     * Registers a new user with email/password.
     */
    async register(
        supabase: SupabaseClient,
        email: string,
        password: string
    ): Promise<{ user: User | null; session: Session | null; error: AuthError | null }> {
        const { data, error } = await supabase.auth.signUp({ email, password });

        return {
            user: data?.user ?? null,
            session: data?.session ?? null,
            error,
        };
    }

    /**
     * Logs in a user with email/password.
     */
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

    /**
     * Signs out the current user.
     */
    async logout(
        supabase: SupabaseClient
    ): Promise<{ error: AuthError | null }> {
        const { error } = await supabase.auth.signOut();
        return { error };
    }

}

const authService = new AuthService();
export default authService;