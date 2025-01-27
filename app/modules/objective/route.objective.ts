import type { FastifyInstance } from "fastify";
import * as objectiveController from "./controller.objective";
import { checkObjectiveCreator } from "./guards/objective.guard";
import { objectiveFSchema } from "./schemas/updateObjective.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: objectiveFSchema }, objectiveController.create);
    app.patch("/:id", { schema: objectiveFSchema, preHandler: [checkObjectiveCreator] }, objectiveController.update);
    app.get("/:id", { preHandler: [checkObjectiveCreator] }, objectiveController.read);
    app.get("/", objectiveController.list);
};
