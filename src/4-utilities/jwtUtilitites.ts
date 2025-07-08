import { configDotenv } from "dotenv";
configDotenv()
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { UserJWTPayload } from "../app-types/auth.types.js";

class JWTUtilities {
    private secretKey: Secret = process.env.JWT_SECRET!

    public sign(payload: object, options?: SignOptions): string {
        if (!this.secretKey) throw new Error("JWT secret key is not defined");

        const token = jwt.sign(payload, this.secretKey);
        // const token = jwt.sign(payload, this.secretKey, { expiresIn: '1h' });
        return token
    }

    public verify<T = UserJWTPayload>(token: string): T {
        return jwt.verify(token, this.secretKey) as T;
    }

    public decode<T = JwtPayload>(token: string): T | null {
        const decoded = jwt.decode(token) as T | null;
        return decoded
    }

}

const jwtUtilities = new JWTUtilities();
export default jwtUtilities;
