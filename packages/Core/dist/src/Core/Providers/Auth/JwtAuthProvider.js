//import {FastifyRequest} from "fastify";
//import {injectable} from "inversify";
//import {ObjectId} from "mongodb";
//import {Config} from "@Config";
//import {sign, verify} from 'jsonwebtoken';
//
//export interface VerifiedTokenInterface {
//	id: string;
//	seed?: string;
//	iat: number;
//	exp: number;
//	iss: string;
//}
//
//@injectable()
//export class JwtAuthProvider {
//
//	getTokenFromHeader(req: FastifyRequest): string | null {
//		const authHeader = req.headers.authorization;
//		if (!authHeader) {
//			return null;
//		}
//
//		const tokenParts = authHeader.split(" ");
//		if (tokenParts.length !== 2) {
//			return null;
//		}
//
//		const type  = tokenParts[0];
//		const token = tokenParts[1];
//		if (!token || !type) {
//			return null;
//		}
//
//		if (type && token && type === "Bearer") {
//			return token;
//		}
//
//		return null;
//	}
//
//	generateToken(userId: ObjectId) {
//		return sign(
//			{id : userId},
//			Config.app.appKey,
//			Config.auth.jwtSigningOptions
//		);
//	}
//
//	verifyToken(request: FastifyRequest, token?: string | null) {
//		if (!token) {
//			token = this.getTokenFromHeader(request);
//		}
//
//		if (!token) {
//			return null;
//		}
//
//		return <VerifiedTokenInterface>verify(
//			token,
//			Config.app.appKey,
//			Config.auth.jwtVerifyOptions
//		);
//	}
//}
//# sourceMappingURL=JwtAuthProvider.js.map