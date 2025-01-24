import type { FastifyJWTOptions } from '@fastify/jwt';
import type { FastifyRegisterOptions } from 'fastify';


declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: {
            id?: string;
        };
    }
}

export const jwtOption: FastifyRegisterOptions<FastifyJWTOptions> = {
    secret: process.env.JWT_SECRET!,
    sign: { expiresIn: '7d' }
};
