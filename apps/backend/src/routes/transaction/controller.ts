import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTransactionBody } from "./schema";
import { Ofx } from "ofx-data-extractor";
import { Db } from "@financial-organizer/db";
import { parseDate } from "../../utils";
import { DateTime } from "luxon";

export async function getAllTransactions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const transactions = await Db.instance.transaction.findMany({
      where: {
        userId: request.user.id,
      },
      include: {
        bankStatement: true,
        tag: true,
      },
    });

    reply.status(200).send({ transactions });
  } catch (error) {
    reply.status(500).send({ message: "Unknown error" });
  }
}

export async function createTransaction(
  request: FastifyRequest<{ Body: CreateTransactionBody }>,
  reply: FastifyReply,
) {
  const { date, description, tag, type, value } = request.body;

  const dateFormatted = DateTime.fromISO(date).toUTC();

  if (!dateFormatted.isValid)
    return reply.status(400).send({ message: "Date invalid" });

  let dbTag = await Db.instance.tag.findFirst({
    where: {
      name: tag,
    },
  });

  if (!dbTag) {
    dbTag = await Db.instance.tag.create({
      data: {
        name: tag,
        color: "#ef23ab",
        userId: request.user.id,
      },
    });
  }

  const newTransaction = await Db.instance.transaction.create({
    data: {
      description,
      type: type as "Credit" | "Debit",
      value,
      tagId: dbTag.id,
      transactionDate: dateFormatted.toISO(),
      userId: request.user.id,
    },
  });

  reply.status(200).send({ transaction: newTransaction });
}

export async function uploadFile(request: FastifyRequest, reply: FastifyReply) {
  const file = await request.file();
  const { id } = request.user;

  if (file) {
    const data = (await file.toBuffer()).toString();
    const ofx = new Ofx(data);
    const ofxResponse = ofx.toJson();
    const bankStatement = await Db.instance.bankStatement.create({
      data: {
        name: file.filename,
        userId: id,
      },
    });
    const transactions =
      ofxResponse.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STRTTRN.map(
        (transaction) => {
          const transactionValue = Number(transaction.TRNAMT);
          return {
            description: transaction.MEMO,
            value: Math.abs(transactionValue),
            type: (transactionValue > 0 ? "Credit" : "Debit") as
              | "Credit"
              | "Debit",
            transactionDate: parseDate(transaction.DTPOSTED as any) ?? "",
            fitId: transaction.FITID.toString(),
            userId: id,
            bankStatementId: bankStatement.id,
          };
        },
      );
    await Db.instance.transaction.createMany({
      data: transactions,
    });
    reply.status(200).send("ok");
  }

  reply.status(400).send({ error: "No file uploaded" });
}

export async function getLastFiveTransactions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const transactions = await Db.instance.transaction.findMany({
    where: {
      userId: request.user.id,
    },
    orderBy: {
      transactionDate: "desc",
    },
    take: 5,
  });

  reply.status(200).send({ transactions });
}