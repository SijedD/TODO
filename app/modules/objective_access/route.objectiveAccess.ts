import { FastifyInstance } from "fastify";
import { checkObjective } from "../objective/guards/objective.guard";
import * as objectiveAccessController from "./controller.objectiveAccess";
import { objectiveAccessFSchema } from "./schemas/objectiveAccess.schema";
export const objectiveAccessRouter = async (app: FastifyInstance) => {
    app.post("/:id/share", { schema: objectiveAccessFSchema, preHandler: [checkObjective] }, objectiveAccessController.objectiveShare);
};
