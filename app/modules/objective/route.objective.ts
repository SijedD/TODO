import type { FastifyInstance } from "fastify";
import * as objectiveController from "./controller.objective";
import { objectiveFSchema } from "./schemas/objective.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: objectiveFSchema, config: { isPublic: true } }, objectiveController.create);
    app.patch("/:id", { schema: objectiveFSchema, config: { isPublic: true } }, objectiveController.update);
    app.get("/:id", objectiveController.read);
    app.get("/", objectiveController.list);
};