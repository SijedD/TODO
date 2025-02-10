import { FastifyRequest } from "fastify";
import { sqlCon } from "../../../common/config/kysely-config";
import { AccessDeniedError } from "../../../common/exceptions/accessDeniedError.guard";
import * as objectiveAccessRepository from "../../objective_access/repository.objectiveAccess";

export const checkObjectiveAccess = async (req: FastifyRequest<{ Params: { id: string } }>) => {
    const objectiveId = req.params.id;
    const userId = req.user.id;

    const accessRecord = await objectiveAccessRepository.findAccessRecord(sqlCon, objectiveId, userId);
    if (!accessRecord) {
        throw new AccessDeniedError();
    }

    return;
};
