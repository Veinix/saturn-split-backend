import { RegisterBody, UserJWTPayload, LoginBody } from "@app-types/auth.types.js";
import { Database, Tables } from "@app-types/database.types.js";
import { SupabaseClient } from '@supabase/supabase-js';
import type { AuthError } from '@supabase/supabase-js';
import jwtUtilities from "@utilities/jwtUtilitites.js";
import { hash, verify } from 'argon2';

class AuthService {

    async register(
        supabase: SupabaseClient<Database>,
        body: RegisterBody
    ): Promise<{ token?: string; error?: Error }> {
        console.log(body)
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
            }])
            .select()
            .single()

        if (privErr || !privData) {
            return { error: privErr ?? new Error("Failed to insert private details") };
        }

        // Create the JWT payload & sign
        const payload: UserJWTPayload = {
            userData: {
                partialName: body.full_name?.split(" ")[0] ?? "",
                role: body.role ?? "user",
                userId: pubData.id,
                username: body.username,
                favoriteColor: body.favorite_color ?? "orange",
            }
        };

        const token = jwtUtilities.sign(payload)
        return { token };
    }

    async loginUser(
        supabase: SupabaseClient<Database>,
        body: LoginBody
    ): Promise<{ token?: string; error?: Error }> {

        const { data: pubUser, error: pubErr } = await supabase
            .from('public_users')
            .select()
            .eq('username', body.username)
            .single()

        if (pubErr || !pubUser) {
            return { error: new Error('Invalid username or password') }
        }

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
        const payload: UserJWTPayload = {
            userData: {
                partialName: priv.full_name.split(' ')[0] ?? '',
                role: pubUser.role,
                userId: pubUser.id,
                username: pubUser.username,
                favoriteColor: pubUser.favorite_color ?? 'orange',
            }
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

    async getUserById(
        supabase: SupabaseClient<Database>,
        userId: string
    ): Promise<Tables<"public_users"> | null> {
        const { data, error } = await supabase
            .from('public_users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error("Error fetching user:", error);
            return null;
        }
        return data;

    }

    async getUserByToken(
        supabase: SupabaseClient<Database>,
        token: string
    ): Promise<Tables<"public_users"> | null> {
        const payload = jwtUtilities.decode(token);
        if (!payload || !payload.userData) {
            throw new Error("Invalid token");
        }
        const userId = payload.userData.userId;
        const data = this.getUserById(supabase, userId)
        return data
    }

}

const authService = new AuthService();
export default authService;