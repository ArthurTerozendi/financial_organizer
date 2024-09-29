import { FastifyInstance } from "fastify";
import {
  getCountTransactionsGroupByTag,
  getTransactionsGroupByMonth,
} from "./controller";

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/tags",
    {
      preHandler: [fastify.authenticate],
    },
    getCountTransactionsGroupByTag,
  );

  fastify.get(
    "/yearMonths",
    {
      preHandler: [fastify.authenticate],
    },
    getTransactionsGroupByMonth,
  );
}
