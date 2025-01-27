import type { FastifyInstance } from "fastify";
import * as objectiveController from "./controller.objective";
import { checkObjective } from "./guards/objective.guard";
import { objectiveFSchema } from "./schemas/updateObjective.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: objectiveFSchema }, objectiveController.create);
    app.patch("/:id", { schema: objectiveFSchema, preHandler: [checkObjective] }, objectiveController.update);
    app.get("/:id", { preHandler: [checkObjective] }, objectiveController.read);
    app.get("/", objectiveController.list);
    app.delete("/:id", { preHandler: [checkObjective] }, objectiveController.deleteObjective);
};
