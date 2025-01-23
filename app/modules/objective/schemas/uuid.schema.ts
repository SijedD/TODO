import type { FastifySchema } from "fastify";
import { z } from "zod";

export const uuidSchema = z.object({
    id : z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
});


export type uuidSchema = z.infer<typeof uuidSchema>;
export const uuidFSchema: FastifySchema = { params: uuidSchema };