import { FastifyReply, FastifyRequest } from "fastify";
import { objectiveAccessSchema } from "./schemas/objectiveAccess.schema";

export async function objectiveShare(req: FastifyRequest<{ Body: objectiveAccessSchema }>, rep: FastifyReply) {}
