import { FastifyMailerOptions } from "fastify-mailer";

export const mailerOption: FastifyMailerOptions = {
    defaults: { from: process.env.MAIL_FROM as string },
    transport: {
        host: process.env.MAIL_HOST as string,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
            user: process.env.MAIL_USER as string,
            pass: process.env.MAIL_PASSWORD as string
        }
    }
};
