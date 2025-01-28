import { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../../common/config/kysely-config";
import { AccessDeniedError } from "../../../common/exceptions/accessDeniedError.guard";
import * as objectiveAccessRepository from "../../objective_access/repository.objectiveAccess";
import * as objectiveRepository from "../repository.objective";

export const getCheckObjective = async (req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) => {
    const creatorId = req.user?.id;
    const objectiveId = req.params.id;

    const existingObjective = await objectiveRepository.findById(sqlCon, objectiveId);

    if (!existingObjective) {
        return rep.code(404).send({ error: "Objective not found" });
    }

    if (existingObjective.creatorId !== creatorId) {
        const userId = req.user?.id;
        const accessRecord = await objectiveAccessRepository.findAccessRecord(sqlCon, objectiveId, userId);
        if (!accessRecord) {
            throw new AccessDeniedError();
        }
    }

    return;
};
