import { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../../common/config/kysely-config";
import * as objectiveRepository from "../repository.objective";
import { objectiveSchema } from "../schemas/objective.schema";
import { uuidSchema } from "../schemas/uuid.schema";
import { AccessDeniedError } from "./accessDeniedError.guard";

export const checkObjectiveCreator = async (req: FastifyRequest<{ Params: { id: string }; Body: typeof objectiveSchema }>, rep: FastifyReply) => {
    const creatorId = req.user?.id;
    const objectiveId = req.params.id;

    if (!uuidSchema.safeParse({ id: objectiveId }).success) {
        return rep.code(400).send({ error: "Invalid Objective ID format" });
    }

    const existingObjective = await objectiveRepository.findById(sqlCon, objectiveId);

    if (!existingObjective) {
        return rep.code(404).send({ error: "Objective not found" });
    }

    if (existingObjective.creatorId !== creatorId) {
        throw new AccessDeniedError();
    }

    (req as any).objective = existingObjective;

    return;
};
