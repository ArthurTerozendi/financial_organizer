import { FastifyInstance } from "fastify";
import { $ref } from "./schema";
import createTransaction from "./controller/createTransaction";
import uploadFile from "./controller/uploadFile";

export default async function(fastify: FastifyInstance) {
  fastify.post('/', {
    schema: {
      body: $ref('CreateTransactionSchema'),
    },
    preHandler: [fastify.authenticate],
  }, createTransaction);

  fastify.post('/uploadFile', {
    preHandler: [fastify.authenticate],
  }, uploadFile);
}