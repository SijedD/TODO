import { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import { CustomException } from "../../common/exceptions/custom-exception";
import * as objectiveAccessRepository from "../objective_access/repository.objectiveAccess";
export async function objectiveShare(req: FastifyRequest<{ Params: { id: string }; Body: { userId: string } }>, rep: FastifyReply) {
    const { id: objectiveId } = req.params;
    const { userId } = req.body;

    const exists = await objectiveAccessRepository.accessExists(sqlCon, objectiveId, userId);
    if (exists) {
        throw new CustomException(HttpStatusCode.CONFLICT, "Access already granted.", { publicMessage: "Access already granted." });
    }

    const user = await objectiveAccessRepository.getUserById(sqlCon, userId);
    if (!user || !user.email) {
        throw new CustomException(HttpStatusCode.CONFLICT, "User not found or has no email.", { publicMessage: "User not found or has no email." });
    }

    await objectiveAccessRepository.insertAccess(sqlCon, objectiveId, userId);

    await req.server.mailer.sendMail({
        to: user.email,
        subject: `User Objective Share`,
        text: `User has shared objective: ${objectiveId}`
    });

    return rep.code(HttpStatusCode.OK).send({ message: "Access granted successfully." });
}

export async function objectiveRevoke(req: FastifyRequest<{ Params: { id: string }; Body: { userId: string } }>, rep: FastifyReply) {
    const { id: objectiveId } = req.params;
    const { userId } = req.body; // заменено user_id на userId

    const exists = await objectiveAccessRepository.accessExists(sqlCon, objectiveId, userId);
    if (!exists) {
        throw new CustomException(HttpStatusCode.CONFLICT, "Access not found or already revoked.", { publicMessage: "Access not found or already revoked." });
    }

    await objectiveAccessRepository.revokeAccess(sqlCon, objectiveId, userId);
    return rep.code(HttpStatusCode.OK).send({ message: "Access successfully revoked." });
}

export async function objectiveListGrants(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const { id: objectiveId } = req.params;

    const users = await objectiveAccessRepository.getAccessList(sqlCon, objectiveId);

    return rep.code(HttpStatusCode.OK).send({ users });
}
