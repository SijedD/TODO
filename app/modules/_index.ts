import type { FastifyInstance } from "fastify";
import { objectiveRouter } from "./objective/route.objective";
import { objectiveAccessRouter } from "./objective_access/route.objectiveAccess";
import { userRouter } from "./user/router.user";

interface IProvider {
    instance: (app: FastifyInstance) => Promise<void>;
    prefix: string;
}

export const HttpProvider: IProvider[] = [
    { instance: userRouter, prefix: "user" },
    { instance: objectiveRouter, prefix: "objective/to-do" },
    { instance: objectiveAccessRouter, prefix: "to-do" }
];
