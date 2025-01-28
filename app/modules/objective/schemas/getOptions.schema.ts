import type { FastifySchema } from "fastify";
import { z } from "zod";

export const getOptionsSchema = z.object({
    search: z.string().optional(),
    sortBy: z.enum(["title", "createdAt", "notifyAt"]),
    order: z.enum(["asc", "desc"]),
    limit: z.number().int().positive().min(1),
    offset: z.number().int().nonnegative().min(0),
    isCompleted: z.preprocess((value) => {
        if (value === "true") return true;
        if (value === "false") return false;
        return undefined;
    }, z.boolean().optional())
});

export type getOptionsSchema = z.infer<typeof getOptionsSchema>;
export const getOptionsFSchema: FastifySchema = { params: getOptionsSchema };
