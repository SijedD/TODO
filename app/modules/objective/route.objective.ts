import type { FastifyInstance } from "fastify";
import * as objectiveController from "./controller.objective";
import { getCheckObjective } from "./guards/getObjective.guard";
import { checkObjective } from "./guards/objective.guard";
import { createObjectiveFSchema } from "./schemas/createObjective.schema";
import { updateObjectiveFSchema } from "./schemas/updateObjective.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: createObjectiveFSchema }, objectiveController.create);
    app.patch("/:id", { schema: updateObjectiveFSchema, preHandler: [checkObjective] }, objectiveController.update);
    app.get("/:id", { preHandler: [getCheckObjective] }, objectiveController.read);
    app.get("/", objectiveController.list);
    app.delete("/:id", { preHandler: [checkObjective] }, objectiveController.deleteObjective);
};
