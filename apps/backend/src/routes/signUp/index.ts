import { FastifyInstance } from "fastify";
import { $ref } from "./schema";
import { singUp } from "./controller";

export default async function (fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: {
        body: $ref("SignUpSchema"),
      },
    },
    singUp,
  );
}
