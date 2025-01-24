import type { FastifyInstance } from 'fastify';
import { userRouter } from './user/router.user';
import {objectiveRouter} from './objective/route.objective';

interface IProvider {
    instance: (app: FastifyInstance) => Promise<void>;
    prefix: string;
}

export const HttpProvider: IProvider[] = [{ instance: userRouter, prefix: 'user' },{ instance: objectiveRouter, prefix: 'objective/to-do' }];

