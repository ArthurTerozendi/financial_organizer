import { FastifyInstance } from "fastify";
import { getCountTransactionsGroupByTag } from "./controller";

export default async function(fastify: FastifyInstance) {
  fastify.get('/tags', {
    preHandler: [fastify.authenticate],
  }, getCountTransactionsGroupByTag);
}
