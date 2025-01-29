import { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import * as objectiveAccessRepository from "../objective_access/repository.objectiveAccess";
export async function objectiveShare(req: FastifyRequest<{ Params: { id: string }; Body: { user_id: string } }>, rep: FastifyReply) {
    const { id: objectiveId } = req.params;
    const { user_id: userId } = req.body;

    const exists = await objectiveAccessRepository.accessExists(sqlCon, objectiveId, userId);
    if (exists) {
        return rep.code(400).send({ error: "Access already granted." });
    }
    const user = await objectiveAccessRepository.getUserById(sqlCon, userId);
    if (!user || !user.email) {
        return rep.code(404).send({ error: "User not found or has no email." });
    }

    const users = await objectiveAccessRepository.getUserById(sqlCon, userId);

    await objectiveAccessRepository.insertAccess(sqlCon, objectiveId, userId);

    await req.server.mailer.sendMail({
        to: user.email,
        subject: `User Objective Share`,
        text: `User has shared objective with you! Objective: ${objectiveId}`
    });

    return rep.code(201).send({ message: "Access granted successfully." });
}

export async function objectiveRevoke(req: FastifyRequest<{ Params: { id: string }; Body: { user_id: string } }>, rep: FastifyReply) {
    const { id: objectiveId } = req.params;
    const { user_id: userId } = req.body;

    const exists = await objectiveAccessRepository.accessExists(sqlCon, objectiveId, userId);
    if (!exists) {
        return rep.code(404).send({ error: "Access not found or already revoked." });
    }

    await objectiveAccessRepository.revokeAccess(sqlCon, objectiveId, userId);
    return rep.code(200).send({ message: "Access successfully revoked." });
}

export async function objectiveListGrants(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const { id: objectiveId } = req.params;

    const users = await objectiveAccessRepository.getAccessList(sqlCon, objectiveId);

    return rep.code(200).send({ users });
}
