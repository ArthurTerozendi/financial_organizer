import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fjwt, { FastifyJWT } from '@fastify/jwt';
import fCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import { fileURLToPath } from 'url';
import autoLoad from '@fastify/autoload';
import { dirname, join } from 'path';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import dotenv from 'dotenv';
import { LoginSchemas } from './routes/login/schema';
import { SignUpSchemas } from './routes/signUp/schema';
import { TransactionSchemas } from './routes/transaction/schema';

dotenv.config();

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const fastify = Fastify({
  logger: true
});

fastify.register(cors);
  
await fastify.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.0',
    
    info: {
      title: 'Financial Organizer - Swagger',
      description: 'Swagger documentation for Financial Organizer',
      version: '1.0.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    }
  }
})

await fastify.register(fastifySwaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (_request, _reply, next) { next() },
    preHandler: function (_request, _reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, _request, _reply) => { return swaggerObject },
  transformSpecificationClone: true
})

fastify.register(autoLoad, {
  dir: join(__dirname, 'routes'),
  options: { prefix: '/api' }
});

for (const schema of [...LoginSchemas, ...SignUpSchemas, ...TransactionSchemas]) {
  fastify.addSchema(schema);
}


fastify.register(fjwt, { secret: 'SECRET_NEED_TO_BE_CHANGED' })

fastify.addHook('preHandler', (req, _res, next) => {
  req.jwt = fastify.jwt;
  return next();
})

fastify.register(fCookie, {
  secret: 'some-secret-key',
  hook: 'preHandler',
});

fastify.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
  const token = req.cookies.access_token;
  if (!token) {
    return reply.status(401).send({ message: 'Authentication required' });
  }

  const decoded = req.jwt.verify<FastifyJWT['user']>(token);
  req.user = decoded;
});


await fastify.ready();
fastify.swagger();

fastify.listen({ port: Number(process.env.PORT) }, (err, address) => {
  if(err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info({port: process.env.PORT}, `Server is now listening on ${address}`);
});