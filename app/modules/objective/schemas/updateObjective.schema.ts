import type { FastifySchema } from "fastify";
import { z } from "zod";
import { uuidFSchema } from "./uuid.schema";

const schema = z.object({
    title: z.string().min(1).max(127),
    description: z.string().optional(),
    notifyAt: z.string().datetime(),
    isCompleted: z.boolean()
});

export type updateObjectiveSchema = z.infer<typeof schema>;
export const updateObjectiveFSchema: FastifySchema = { params: uuidFSchema.params, body: schema };
