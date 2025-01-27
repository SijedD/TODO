import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    objective_id: z.string().uuid(),
    user_id: z.string().uuid()
});

export type objectiveAccessSchema = z.infer<typeof schema>;
export const objectiveAccessFSchema: FastifySchema = { body: schema };
