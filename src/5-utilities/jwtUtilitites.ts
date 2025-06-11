import { configDotenv } from "dotenv";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
configDotenv()

class JWTUtilities {
    private secretKey: string = process.env.JWT_SECRET!
    private expiresIn: string = "1h";

    public sign(payload: object, options?: SignOptions): string {
        if (!this.secretKey) throw new Error("JWT secret key is not defined");

        const token = jwt.sign(payload, this.secretKey,)
        return token
    }

    public verify<T = JwtPayload>(token: string): T {
        return jwt.verify(token, this.secretKey) as T;
    }

    public decode<T = JwtPayload>(token: string): T | null {
        return jwt.decode(token) as T | null;
    }

}

const jwtUtilities = new JWTUtilities();
export default jwtUtilities;
