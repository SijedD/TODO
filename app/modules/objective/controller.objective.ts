import { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import * as objectiveRepository from "./repository.objective";
import { objectiveSchema } from "./schemas/objective.schema";
import { optionsSchema } from "./schemas/options.schema";
import { uuidSchema } from "./schemas/uuid.schema";

export async function create(req: FastifyRequest<{ Body: objectiveSchema }>, rep: FastifyReply) {
    const creatorId = req.user?.id;

    const objective = {
        ...req.body,
        creatorId
    };

    const insertedObjective = await objectiveRepository.insert(sqlCon, objective);
    return rep.code(200).send(insertedObjective);
}

export async function update(req: FastifyRequest<{ Params: { id: string }; Body: objectiveSchema }>, rep: FastifyReply) {
    const result = await objectiveRepository.update(sqlCon, req.params.id, req.body);
    return rep.code(200).send(result);
}

export async function read(req: FastifyRequest<{ Params: { id: string }; Body: objectiveSchema }>, rep: FastifyReply) {
    const { id: objectiveId } = uuidSchema.parse(req.params);

    const existingObjective = await objectiveRepository.findById(sqlCon, objectiveId);

    if (!existingObjective) {
        return rep.code(404).send({ error: "Objective not found" });
    }
    return rep.code(200).send(existingObjective);
}

export async function list(req: FastifyRequest<{ Querystring: optionsSchema }>, rep: FastifyReply) {
    const tasks = await objectiveRepository.findAllTasks(sqlCon, req.query);

    return rep.code(200).send(tasks);
}
