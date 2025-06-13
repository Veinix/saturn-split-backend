import { SupabaseClient } from '@supabase/supabase-js';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { JWTPayload, LoginBody, RegisterBody } from '../types/auth.types';
import { hash, verify } from 'argon2';
import jwtUtilities from "../5-utilities/jwtUtilitites";
import { Database } from '../types/database.types';

class AuthService {

    async register(
        supabase: SupabaseClient<Database>,
        body: RegisterBody
    ): Promise<{ token?: string; error?: Error }> {
        const hashedPassword = await hash(body.password);

        const { data: pubData, error: pubErr } = await supabase
            .from("public_users")
            .insert([{
                username: body.username,
                favorite_color: body.favorite_color ?? null,
                role: body.role ?? "user",
            }])
            .select("id")
            .single();

        if (pubErr) {
            switch (pubErr.code) {
                case "23505":
                    return { error: new Error("Username already taken") }
                default:
                    return { error: pubErr };;
            }

        }

        const { data: privData, error: privErr } = await supabase
            .from("private_user_details")
            .insert([{
                user_id: pubData.id,
                full_name: body.full_name,
                hashed_password: hashedPassword,
                phone_number: body.phone_number ?? null,
            }])
            .select()
            .single()

        if (privErr || !privData) {
            return { error: privErr ?? new Error("Failed to insert private details") };
        }

        // Create the JWT payload & sign
        const nowSec = Math.floor(Date.now() / 1000);
        const payload: JWTPayload = {
            userData: {
                partialName: body.full_name?.split(" ")[0] ?? "",
                role: body.role ?? "user",
                userId: pubData.id,
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
        supabase: SupabaseClient<Database>,
        body: LoginBody
    ): Promise<{ token?: string; error?: Error }> {
        // 1. Fetch the public user by username
        console.log(body.username)
        console.log(body.password)
        const { data: pubUser, error: pubErr } = await supabase
            .from('public_users')
            .select()
            .eq('username', body.username)
            .single()

        if (pubErr || !pubUser) {
            return { error: new Error('Invalid username or password') }
        }

        // 2. Fetch the private details (hashed_password + full_name)
        const { data: priv, error: privErr } = await supabase
            .from('private_user_details')
            .select('hashed_password, full_name')
            .eq('user_id', pubUser.id)
            .single()

        if (privErr || !priv) {
            // This shouldn’t happen under normal circumstances
            return { error: new Error('User credentials not found') }
        }

        // 3. Verify the password
        const isValid = await verify(priv.hashed_password, body.password)
        if (!isValid) {
            return { error: new Error('Invalid username or password [TODO] Password not matched') }
        }

        // 4. Build and sign the JWT
        const nowSec = Math.floor(Date.now() / 1000)
        const payload: JWTPayload = {
            userData: {
                partialName: priv.full_name.split(' ')[0] ?? '',
                role: pubUser.role,
                userId: pubUser.id,
                username: pubUser.username,
                favoriteColor: pubUser.favorite_color ?? 'orange',
            },
            iat: nowSec,
            exp: nowSec + 60 * 60, // 1 hour
        }
        const token = jwtUtilities.sign(payload)

        return { token }
    }

    async logout(
        supabase: SupabaseClient
    ): Promise<{ error: AuthError | null }> {
        const { error } = await supabase.auth.signOut();
        return { error };
    }

}

const authService = new AuthService();
export default authService;