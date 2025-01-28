import { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import * as objectiveAccessRepository from "../objective_access/repository.objectiveAccess";

export async function objectiveShare(req: FastifyRequest<{ Params: { id: string }; Body: { user_id: string } }>, rep: FastifyReply) {
    const { id: objectiveId } = req.params;
    const { user_id: userId } = req.body;

    await objectiveAccessRepository.insertAccess(sqlCon, objectiveId, userId);

    return rep.code(201).send({ message: "Access granted successfully." });
}

export async function objectiveRevoke(req: FastifyRequest<{ Params: { id: string }; Body: { user_id: string } }>, rep: FastifyReply) {
    const { id: objectiveId } = req.params;
    const { user_id: userId } = req.body;

    const exists = await objectiveAccessRepository.accessExists(sqlCon, objectiveId, userId);
    if (!exists) {
        return rep.code(404).send({ error: "Access or objective not found." });
    }

    await objectiveAccessRepository.revokeAccess(sqlCon, objectiveId, userId);
    return rep.code(200).send({ message: "Access successfully revoked." });
}
