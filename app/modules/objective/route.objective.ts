import type { FastifyInstance } from 'fastify';
import * as objectiveController from './controller.objective';
import { objectiveFSchema } from './schemas/objective.schema';
import { checkObjectiveCreator } from './guards/objective.guard';

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post('/', { schema: objectiveFSchema }, objectiveController.create);
    app.patch('/:id', { schema: objectiveFSchema, preHandler: [checkObjectiveCreator] }, objectiveController.update);
    app.get('/:id', objectiveController.read);
    app.get('/', objectiveController.list);
};