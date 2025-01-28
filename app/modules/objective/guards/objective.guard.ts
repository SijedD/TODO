import { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../../common/config/kysely-config";
import { AccessDeniedError } from "../../../common/exceptions/accessDeniedError.guard";
import * as objectiveRepository from "../repository.objective";

export const checkObjective = async (req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) => {
    const creatorId = req.user?.id;
    const objectiveId = req.params.id;

    const existingObjective = await objectiveRepository.findById(sqlCon, objectiveId);

    if (!existingObjective) {
        return rep.code(404).send({ error: "Objective not found" });
    }

    if (existingObjective.creatorId !== creatorId) {
        throw new AccessDeniedError();
    }

    return;
};
