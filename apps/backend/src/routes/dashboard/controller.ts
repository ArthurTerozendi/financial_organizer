import { Db } from "@financial-organizer/db";
import { FastifyRequest, FastifyReply } from "fastify"

export async function getCountTransactionsGroupByTag(request: FastifyRequest, reply: FastifyReply) {
  try {
    const transactions = await Db.instance.transaction.findMany({
      where: {
        userId: request.user.id
      },
      include: {
        tag: true,
      }
    });
  
    const transactionsGrouped = transactions.reduce((acc, transaction) => {
      if (!transaction.tagId) {
        if (acc.other) {
          acc.other.count++;
        } else {
          acc['other'] = {
            count: 1,
            label: 'Outros',
            color: '#21A805'
          }
        }
      } else if (!acc[transaction.tagId]) {
        acc[transaction.tagId] = {
          count: 1,
          label: transaction.tag?.name || '',
          color: transaction.tag?.color || '#8AA245'
        }
      } else {
        acc[transaction.tagId].count++;
      }

      return acc;
    }, {} as { [key: string]: { count: number, label: string, color: string } })

    reply.status(200).send({ transactionsGrouped })
  } catch (error) {
    reply.status(500).send({ message: 'Unknown error' });
  }
}