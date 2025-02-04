import { FastifyRequest } from "fastify";
import { sqlCon } from "../../../common/config/kysely-config";
import { HttpStatusCode } from "../../../common/enum/http-status-code";
import { AccessDeniedError } from "../../../common/exceptions/accessDeniedError.guard";
import { CustomException } from "../../../common/exceptions/custom-exception";
import * as objectiveAccessRepository from "../../objective_access/repository.objectiveAccess";
import * as objectiveRepository from "../repository.objective";

export const getCheckObjective = async (req: FastifyRequest<{ Params: { id: string } }>) => {
    const creatorId = req.user.id!;
    const objectiveId = req.params.id;

    const existingObjective = await objectiveRepository.findById(sqlCon, objectiveId);

    if (!existingObjective) {
        throw new CustomException(HttpStatusCode.CONFLICT, "Objective not found", { publicMessage: "Objective not found" });
    }

    if (existingObjective.creatorId !== creatorId) {
        const userId = req.user.id!;
        const accessRecord = await objectiveAccessRepository.findAccessRecord(sqlCon, objectiveId, userId);
        if (!accessRecord) {
            throw new AccessDeniedError();
        }
    }

    return;
};
