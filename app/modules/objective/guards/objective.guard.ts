import {FastifyReply, FastifyRequest} from "fastify";
import * as objectiveRepository from "../repository.objective";
import {sqlCon} from "../../../common/config/kysely-config";
import {objectiveSchema} from "../schemas/objective.schema";
import { validate as isUuid } from "uuid";

declare module "fastify" {interface FastifyRequest {objective?: typeof objectiveSchema;}}

export const checkObjectiveCreator = async (req: FastifyRequest<{ Params: { id: string }; Body: objectiveSchema }>, rep: FastifyReply) =>
{

    const creatorId = req.user?.id;

    if (!creatorId) {
        return rep.code(401).send({ error: "Unauthorized: Creator ID not found" });
    }

    const objectiveId = req.params.id;

    if (!isUuid(objectiveId)) {
        return rep.code(400).send({ error: "Invalid Objective ID format" });
    }

    const existingObjective = await objectiveRepository.findById(sqlCon, objectiveId);

    if (!existingObjective) {
        return rep.code(404).send({ error: "Objective not found" });
    }

    if (existingObjective.creatorId !== creatorId) {
        return rep.code(403).send({ error: "Forbidden: You are not the creator of this objective" });
    }

    req.objective = existingObjective;
};