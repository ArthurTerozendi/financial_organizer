import { Db } from "@financial-organizer/db";
import { FastifyRequest, FastifyReply } from "fastify";
import { getLastTwelveMonths } from "./utils";

export async function getCountTransactionsGroupByTag(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const transactions = await Db.instance.transaction.findMany({
      where: {
        userId: request.user.id,
      },
      include: {
        tag: true,
      },
    });

    const transactionsGrouped = transactions.reduce(
      (acc, transaction) => {
        if (!transaction.tagId) {
          if (acc.other) {
            acc.other.count++;
          } else {
            acc["other"] = {
              count: 1,
              label: "Outros",
              color: "#21A805",
            };
          }
        } else if (!acc[transaction.tagId]) {
          acc[transaction.tagId] = {
            count: 1,
            label: transaction.tag?.name || "",
            color: transaction.tag?.color || "#8AA245",
          };
        } else {
          acc[transaction.tagId].count++;
        }

        return acc;
      },
      {} as { [key: string]: { count: number; label: string; color: string } },
    );

    reply.status(200).send({ transactionsGrouped });
  } catch (error) {
    reply.status(500).send({ message: "Unknown error" });
  }
}

export async function getTransactionsGroupByMonth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id } = request.user;

    const lastTwelveMonths = getLastTwelveMonths();

    const transactions = await Db.instance.$queryRaw<
      { yearMonth: string; creditAmount: number; debitAmount: number }[]
    >`
      SELECT
        TO_CHAR("transactionDate", 'YYYY-MM') as "yearMonth",
        SUM(CASE WHEN "type" = 'Credit' THEN "value" ELSE 0 END) AS "creditAmount",
        SUM(CASE WHEN "type" = 'Debit' THEN "value" ELSE 0 END) AS "debitAmount"
      FROM "Transaction"
      WHERE "userId" = ${id}
      GROUP BY TO_CHAR("transactionDate", 'YYYY-MM')
      ORDER BY "yearMonth";
    `;

    const transactionsMap = new Map<
      string,
      { creditAmount: number; debitAmount: number }
    >();
    transactions.forEach((t) =>
      transactionsMap.set(t.yearMonth, {
        creditAmount: t.creditAmount,
        debitAmount: t.debitAmount,
      }),
    );

    // Combine with last 12 months
    const result = lastTwelveMonths.map((month) => ({
      yearMonth: month.yearMonth,
      creditAmount: transactionsMap.get(month.yearMonth)?.creditAmount || 0,
      debitAmount: transactionsMap.get(month.yearMonth)?.debitAmount || 0,
    }));

    reply.status(200).send({ transactions: result });
  } catch (error) {
    reply.status(500).send({ message: "Unknown error" });
  }
}
