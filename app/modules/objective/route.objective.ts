import type { FastifyInstance } from "fastify";
import * as objectiveController from "./controller.objective";
import { getCheckObjective } from "./guards/getObjective.guard";
import { checkObjective } from "./guards/objective.guard";
import { createObjectiveFSchema } from "./schemas/createObjective.schema";
import { updateObjectiveFSchema } from "./schemas/updateObjective.schema";
import { uuidFSchema } from "./schemas/uuid.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: createObjectiveFSchema }, objectiveController.create);
    app.patch("/:id", { schema: updateObjectiveFSchema, preHandler: app.auth([checkObjective]) }, objectiveController.update);
    app.get("/:id", { schema: uuidFSchema, preHandler: app.auth([getCheckObjective]) }, objectiveController.read);
    app.get("/", objectiveController.list);
    app.delete("/:id", { schema: uuidFSchema, preHandler: app.auth([checkObjective]) }, objectiveController.deleteObjective);
};
