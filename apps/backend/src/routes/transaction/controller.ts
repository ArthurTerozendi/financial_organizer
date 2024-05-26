import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTransactionBody } from "./schema";

export async function createTransaction(request: FastifyRequest<{ Body: CreateTransactionBody }>, reply: FastifyReply) {
  console.log(request);

  reply.status(200).send('ok');
}