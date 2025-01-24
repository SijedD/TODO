import { FastifyReply, FastifyRequest } from 'fastify';
import { sqlCon } from '../../common/config/kysely-config';
import * as objectiveRepository from './repository.objective';
import { objectiveSchema } from './schemas/objective.schema';
import { optionsSchema } from './schemas/options.schema';
import { uuidSchema } from './schemas/uuid.schema';

export async function create(req: FastifyRequest<{ Body: objectiveSchema }>, rep: FastifyReply) {
    const creatorId = req.user?.id;

    if (!creatorId) {
        return rep.code(401).send({ error: 'Unauthorized: Creator ID not found' });
    }

    const objective = {
        ...req.body,
        creatorId
    };

    const insertedObjective = await objectiveRepository.insert(sqlCon, objective);
    return rep.code(200).send(insertedObjective);
}

export async function update(req: FastifyRequest<{ Params: { id: string }; Body: objectiveSchema }>, rep: FastifyReply) {
    const existingObjective = req.objective;

    const updatedObjective = {
        title: req.body.title || existingObjective.title,
        description: req.body.description || existingObjective.description,
        notifyAt: req.body.notifyAt || existingObjective.notifyAt,
        isCompleted: req.body.isCompleted ?? existingObjective.isCompleted
    };

    const result = await objectiveRepository.update(sqlCon, req.params.id, updatedObjective);
    return rep.code(200).send(result);
}

export async function read(req: FastifyRequest<{ Params: { id: string }; Body: objectiveSchema }>, rep: FastifyReply) {
    try {
        const { id: objectiveId } = uuidSchema.parse(req.params);

        const existingObjective = await objectiveRepository.findById(sqlCon, objectiveId);

        if (!existingObjective) {
            return rep.code(404).send({ error: 'Objective not found' });
        }
        return rep.code(200).send(existingObjective);
    } catch (error) {
        return rep.code(500).send({ error: 'Incorrect format' });
    }
}

export async function list(req: FastifyRequest<{ Querystring: optionsSchema }>, rep: FastifyReply) {
    const { search, sortBy = 'createdAt', order = 'asc', limit = 10, offset = 0, isCompleted } = req.query;

    const validSortFields = ['title', 'createdAt', 'notifyAt'];
    if (!validSortFields.includes(sortBy)) {
        return rep.code(400).send({ error: 'Invalid sortBy field' });
    }

    if (!['asc', 'desc'].includes(order)) {
        return rep.code(400).send({ error: 'Invalid order value' });
    }

    const tasks = await objectiveRepository.findAllTasks(sqlCon, {
        search,
        sortBy,
        order,
        limit,
        offset,
        isCompleted
    });

    return rep.code(200).send(tasks);
}
