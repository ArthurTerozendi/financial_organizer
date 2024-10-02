import { FastifyInstance } from "fastify";
import { $ref } from "./schema";
import { getAllTags, createTag } from "./controller";

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    getAllTags
  );

  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: $ref("CreateTagSchema"),
      },
    },
    createTag
  );
}
