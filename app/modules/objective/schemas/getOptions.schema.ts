import type { FastifySchema } from "fastify";
import { z } from "zod";

export const getOptionsSchema = z.object({
    search: z.string().optional(),
    sortBy: z.enum(["title", "createdAt", "notifyAt"]).default("createdAt"),
    order: z.enum(["asc", "desc"]).default("asc"),
    limit: z.coerce.number().min(1).default(10),
    offset: z.coerce.number().min(0).default(0),
    isCompleted: z.preprocess((value) => {
        if (value === "true") return true;
        if (value === "false") return false;
        return undefined;
    }, z.boolean().optional())
});

export type getOptionsSchema = z.infer<typeof getOptionsSchema>;
export const getOptionsFSchema: FastifySchema = { querystring: getOptionsSchema };
