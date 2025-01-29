declare module "fastify-mailer" {
    import { FastifyPluginAsync } from "fastify";
    import { SendMailOptions, SentMessageInfo } from "nodemailer";

    interface FastifyMailerOptions {
        defaults: { from: string };
        transport: {
            host: string;
            port: number;
            secure: boolean;
            auth: {
                user: string;
                pass: string;
            };
        };
    }

    interface FastifyMailer {
        sendMail: (options: SendMailOptions, callback: (error: Error | null, info: SentMessageInfo) => void) => void;
    }

    export const fastifyMailer: FastifyPluginAsync<FastifyMailerOptions>;

    export interface FastifyInstance {
        mailer: FastifyMailer;
    }
}
