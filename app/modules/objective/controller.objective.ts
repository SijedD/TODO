import { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import * as objectiveRepository from "./repository.objective";
import { createObjectiveSchema } from "./schemas/createObjective.schema";
import { getOptionsSchema } from "./schemas/getOptions.schema";
import { updateObjectiveSchema } from "./schemas/updateObjective.schema";
import { uuidSchema } from "./schemas/uuid.schema";

export async function create(req: FastifyRequest<{ Body: createObjectiveSchema }>, rep: FastifyReply) {
    const objective = {
        ...req.body,
        creatorId: req.user.id!
    };

    const insertedObjective = await objectiveRepository.insert(sqlCon, objective);
    return rep.code(HttpStatusCode.OK).send(insertedObjective);
}

export async function update(req: FastifyRequest<{ Params: { id: string }; Body: updateObjectiveSchema }>, rep: FastifyReply) {
    const result = await objectiveRepository.update(sqlCon, req.params.id, req.body);
    return rep.code(HttpStatusCode.OK).send(result);
}

export async function read(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const { id: objectiveId } = uuidSchema.parse(req.params);

    const existingObjective = await objectiveRepository.findById(sqlCon, objectiveId);

    return rep.code(HttpStatusCode.OK).send(existingObjective);
}

export async function list(req: FastifyRequest<{ Querystring: getOptionsSchema }>, rep: FastifyReply) {
    const validatedOptions = getOptionsSchema.parse(req.query);
    const tasks = await objectiveRepository.findAllTasks(sqlCon, validatedOptions);
    return rep.code(HttpStatusCode.OK).send(tasks);
}

export async function deleteObjective(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const objectiveId = req.params.id;

    await objectiveRepository.deleteObjective(sqlCon, objectiveId);

    return rep.code(HttpStatusCode.OK).send({ message: "Objective successfully deleted" });
}
