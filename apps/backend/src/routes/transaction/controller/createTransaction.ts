import { Db } from "@financial-organizer/db";
import { FastifyRequest, FastifyReply } from "fastify";
import { DateTime } from "luxon";
import { CreateTransactionBody } from "../schema";

async function createTransaction(request: FastifyRequest<{ Body: CreateTransactionBody }>, reply: FastifyReply) {
  const { date, description, tag, type, value } = request.body;

  const dateFormatted = DateTime.fromISO(date).toUTC();

  if (!dateFormatted.isValid) return reply.status(400).send({ message: 'Date invalid' }); 

  let dbTag = await Db.instance.tag.findFirst({ where: {
    name: tag,
  } })
  
  if (!dbTag) {
    dbTag = await Db.instance.tag.create({
      data: {
        name: tag,
        color: '#ef23ab',
        userId: request.user.id,
      }
    })
  }

  const newTransaction = await Db.instance.transaction.create({
    data: {
      description,
      type: type as 'Credit' | 'Debit',
      value,
      tagId: dbTag.id,
      transactionDate: dateFormatted.toISO(),
      userId: request.user.id,
    }
  });

  reply.status(200).send({ transaction: newTransaction });
}

export default createTransaction;