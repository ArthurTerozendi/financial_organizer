import { FastifyInstance } from "fastify";
import { $ref } from "./schema";
import { login } from "./controller";

export default async function(fastify: FastifyInstance) {
  fastify.post('/', {
    schema: {
      body: $ref('LoginSchema'),
    }
  }, login)
}