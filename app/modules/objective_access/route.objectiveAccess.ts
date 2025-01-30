import { FastifyInstance } from "fastify";
import { getCheckObjective } from "../objective/guards/getObjective.guard";
import { checkObjective } from "../objective/guards/objective.guard";
import { uuidFSchema } from "../objective/schemas/uuid.schema";
import * as objectiveAccessController from "./controller.objectiveAccess";
import { objectiveAccessFSchema } from "./schemas/objectiveAccess.schema";
export const objectiveAccessRouter = async (app: FastifyInstance) => {
    app.post("/:id/share", { schema: objectiveAccessFSchema, preHandler: app.auth([checkObjective]) }, objectiveAccessController.objectiveShare);
    app.delete("/:id/revoke", { preHandler: app.auth([checkObjective]) }, objectiveAccessController.objectiveRevoke);
    app.get("/:id/list-grants", { schema: uuidFSchema, preHandler: app.auth([getCheckObjective]) }, objectiveAccessController.objectiveListGrants);
};
