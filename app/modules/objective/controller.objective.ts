import {FastifyReply, FastifyRequest} from "fastify";
import {objectiveSchema} from "./schemas/objective.schema";
import * as objectiveRepository from "./repository.objective";
import {sqlCon} from "../../common/config/kysely-config";
import {findAllTasks, findById, validateUUID} from "./repository.objective";


export async function create(req: FastifyRequest<{ Body: objectiveSchema }>, rep: FastifyReply) {

    req.user = await req.jwtVerify();
    const creatorId = req.user?.id;

    if (!creatorId) {
        return rep.code(401).send({ error: "Unauthorized: Creator ID not found" });
    }

    // Создаём задачу
    const objective = {
        title: req.body.title,
        description: req.body.description,
        creatorId, // Используем id из токена
        notifyAt: req.body.notifyAt,
        isCompleted: req.body.isCompleted,
    };

    // Вставляем задачу в базу данных
    const insertedObjective = await objectiveRepository.insert(sqlCon, objective);

    return rep.code(200).send(insertedObjective);
}


export async function update(req: FastifyRequest<{ Params: { id: string }, Body: objectiveSchema }>, rep: FastifyReply) {

    // Проверка токена и получение данных пользователя
    req.user = await req.jwtVerify();
    const creatorId = req.user?.id;

    if (!creatorId) {
        return rep.code(401).send({ error: "Unauthorized: Creator ID not found" });
    }

    const objectiveId = req.params.id;

    const existingObjective = await objectiveRepository.findById(sqlCon, objectiveId);
    if (!existingObjective) {
        return rep.code(404).send({ error: "Objective not found" });
    }

    if (existingObjective.creatorId !== creatorId) {
        return rep.code(403).send({ error: "Forbidden: You are not the creator of this objective" });
    }

    const updatedObjective = {
        title: req.body.title || existingObjective.title,
        description: req.body.description || existingObjective.description,
        notifyAt: req.body.notifyAt || existingObjective.notifyAt,
        isCompleted: req.body.isCompleted ?? existingObjective.isCompleted,
    };

    const result = await objectiveRepository.update(sqlCon, objectiveId, updatedObjective);

    return rep.code(200).send(result);
}


export async function read(req: FastifyRequest<{ Params: { id: string }, Body: objectiveSchema }>, rep: FastifyReply) {

    const objectiveId = req.params.id;

    if (!validateUUID(objectiveId)) {
        return rep.code(400).send({ error: 'Invalid UUID format' });
    }

    const existingObjective = await objectiveRepository.findById(sqlCon, objectiveId);
    if (!existingObjective) {
        return rep.code(404).send({ error: "Objective not found" });
    }


    return rep.code(200).send(existingObjective);
}


export async function list(req: FastifyRequest<{ Querystring: { search?: string;
    sortBy?: 'title' | 'createdAt' | 'notifyAt';
    order?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
    is_completed?: boolean; }; }>, rep: FastifyReply)
{
    try {
        const {
            search,
            sortBy = 'createdAt',
            order = 'asc',
            limit = 10,
            offset = 0,
            is_completed,
        } = req.query;

        
        const validSortFields = ['title', 'createdAt', 'notifyAt'];
        if (!validSortFields.includes(sortBy)) {
            return rep.code(400).send({ error: 'Invalid sortBy field' });
        }

        if (!['asc', 'desc'].includes(order)) {
            return rep.code(400).send({ error: 'Invalid order value' });
        }

        // Выполняем запрос к базе данных с фильтрацией, сортировкой и пагинацией
        const tasks = await objectiveRepository.findAllTasks(sqlCon, {
            search,
            sortBy,
            order,
            limit,
            offset,
            is_completed,
        });

        return rep.code(200).send(tasks);
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        return rep.code(500).send({ error: 'Internal server error' });
    }
}