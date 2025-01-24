import type { FastifySchema } from 'fastify';
import { z } from 'zod';

export const optionsSchema = z.object({
    search: z.string().optional(),
    sortBy: z.enum(['title', 'createdAt', 'notifyAt']),
    order: z.enum(['asc', 'desc']),
    limit: z.number().int().positive(),
    offset: z.number().int().nonnegative(),
    isCompleted: z.boolean().optional(),
});


export type optionsSchema = z.infer<typeof optionsSchema>;
export const optionsFSchema: FastifySchema = { params: optionsSchema };