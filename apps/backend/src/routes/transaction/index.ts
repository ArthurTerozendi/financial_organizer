import { FastifyInstance } from "fastify";
import { $ref } from "./schema";
import {
  createTransaction,
  getAllTransactions,
  getLastFiveTransactions,
  uploadFile,
} from "./controller";

export default async function (fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: {
        body: $ref("CreateTransactionSchema"),
      },
      preHandler: [fastify.authenticate],
    },
    createTransaction,
  );

  fastify.post(
    "/uploadFile",
    {
      preHandler: [fastify.authenticate],
    },
    uploadFile,
  );

  fastify.get(
    "/all",
    {
      preHandler: [fastify.authenticate],
    },
    getAllTransactions,
  );

  fastify.get(
    "/lastFiveTransactions",
    {
      preHandler: [fastify.authenticate],
    },
    getLastFiveTransactions,
  );
}
