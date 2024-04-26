import Fastify from 'fastify';
import cors from '@fastify/cors';
import { fileURLToPath } from 'url';
import autoLoad from '@fastify/autoload';
import { dirname, join } from 'path';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

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


await fastify.ready();
fastify.swagger();

fastify.listen({port: 3000}, (err, address) => {
  if(err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info({port: 3000}, `Server is now listening on ${address}`);
});