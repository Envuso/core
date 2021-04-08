import { FastifyRequest } from "fastify";
import { ObjectId } from "mongodb";
export interface VerifiedTokenInterface {
    id: string;
    seed?: string;
    iat: number;
    exp: number;
    iss: string;
}
export declare class JwtAuthProvider {
    getTokenFromHeader(req: FastifyRequest): string | null;
    generateToken(userId: ObjectId): string;
    verifyToken(request: FastifyRequest, token?: string | null): VerifiedTokenInterface;
}
