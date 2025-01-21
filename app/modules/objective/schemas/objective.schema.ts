import type { FastifySchema } from "fastify";
import { z } from "zod";



const schema = z.object({
    title: z.string().min(1).max(127),
    description: z.string().nullable(),
    notifyAt: z.string().datetime(),
    isCompleted: z.boolean()
});

export type objectiveSchema = z.infer<typeof schema>;
export const objectiveFSchema: FastifySchema = { body: schema };