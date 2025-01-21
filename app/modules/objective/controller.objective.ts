import {FastifyReply, FastifyRequest} from "fastify";
import {objectiveSchema} from "./schemas/objective.schema";
import * as objectiveRepository from "./repository.objective";
import {sqlCon} from "../../common/config/kysely-config";


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