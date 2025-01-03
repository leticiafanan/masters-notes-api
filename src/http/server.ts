import 'dotenv/config';
import fastifyJwt from '@fastify/jwt';
import fastify from "fastify";
import { setupMongo } from '../database';
import { articlesRoutes } from "./controllers/articles/route";
import { ZodError } from "zod";
import { AppError } from "../errors/app-errors";
import { userRoutes } from './controllers/users/route';
import { authRoutes } from './controllers/auth/route';

export const app = fastify();

setupMongo()
  .then(() => {
    app.register(fastifyJwt, {
      secret: String(process.env.JWT_SECRET),
      sign: {
        expiresIn: String(process.env.JWT_EXPIRATION),
      },
    });

    app.register(authRoutes);
    app.register(userRoutes);
    app.register(articlesRoutes);

    app.setErrorHandler((error, _,reply) => {
      if( error instanceof ZodError) {
        return reply
                .status(400)
                .send({message: 'Validation error.', issues: error.format() });
      }
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({message: error.message});
      }
      console.log(error);

      return reply.status(500).send({message: 'Internal server error.'});
    });

    app
        .listen({
            host: '0.0.0.0',
            port: 4000,
        })
        .then(() => {
          console.log('🚀Server is running at port 4000...');
        });
  })

  .catch((err) => {
    console.log(err);
  });