import { FastifyInstance } from "fastify";
import { $ref } from "./schema";
import { createTransaction } from "./controller";

export default async function(fastify: FastifyInstance) {
  fastify.post('/', {
    schema: {
      body: $ref('CreateTrasactionSchema'),
    },
    preHandler: [fastify.authenticate],
  }, createTransaction)
}