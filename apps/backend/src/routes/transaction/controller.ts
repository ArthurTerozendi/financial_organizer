import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTransactionBody, UpdateTransactionBody } from "./schema";
import { Ofx } from "ofx-data-extractor";
import { Db } from "@financial-organizer/db";
import { parseDate } from "../../utils";
import { DateTime } from "luxon";
import { StatementTransaction } from "./types";

async function parseOFXManually(ofxData: string): Promise<any> {
  try {
    const transactions: any[] = [];
    const transactionRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g;
    let match;

    while ((match = transactionRegex.exec(ofxData)) !== null) {
      const transactionBlock = match[1];

      const trnamtMatch = transactionBlock.match(/<TRNAMT>([^<]+)<\/TRNAMT>/);
      const memoMatch = transactionBlock.match(/<MEMO>([^<]+)<\/MEMO>/);
      const dtpostedMatch = transactionBlock.match(
        /<DTPOSTED>([^<]+)<\/DTPOSTED>/
      );
      const fitidMatch = transactionBlock.match(/<FITID>([^<]+)<\/FITID>/);

      if (trnamtMatch && dtpostedMatch && fitidMatch) {
        transactions.push({
          TRNAMT: trnamtMatch[1],
          MEMO: memoMatch ? memoMatch[1] : "No description",
          DTPOSTED: dtpostedMatch[1],
          FITID: fitidMatch[1],
        });
      }
    }

    if (transactions.length === 0) {
      return null;
    }

    return {
      OFX: {
        BANKMSGSRSV1: {
          STMTTRNRS: {
            STMTRS: {
              BANKTRANLIST: {
                STRTTRN: transactions,
              },
            },
          },
        },
      },
    };
  } catch (error) {
    console.error("Manual OFX parsing failed:", error);
    return null;
  }
}

function sanitizeOFXData(data: string): string {
  return data
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
    .replace(/[\uFFFE\uFFFF]/g, "")
    .replace(/\0/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getAllTransactions(
  request: FastifyRequest,
  reply: FastifyReply
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
  reply: FastifyReply
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

  if (!file) {
    return reply.status(400).send({ error: "Nenhum arquivo enviado" });
  }
  try {
    const data = (await file.toBuffer()).toString();
    const cleanedData = sanitizeOFXData(data);

    if (!cleanedData.includes("<OFX>") || !cleanedData.includes("</OFX>")) {
      return reply.status(400).send({
        error: "Arquivo não parece ser um arquivo OFX válido",
      });
    }

    const ofx = new Ofx(cleanedData);
    let ofxResponse;
    try {
      ofxResponse = ofx.toJson();
    } catch (jsonError) {
      console.error("Error parsing OFX to JSON:", jsonError);
      try {
        const alternativeResponse = await parseOFXManually(cleanedData);
        if (alternativeResponse) {
          ofxResponse = alternativeResponse;
        } else {
          return reply.status(400).send({
            error:
              "Erro ao processar arquivo OFX. Verifique se o arquivo está no formato correto.",
          });
        }
      } catch (manualError) {
        console.error("Manual parsing also failed:", manualError);
        return reply.status(400).send({
          error:
            "Erro ao processar arquivo OFX. Verifique se o arquivo está no formato correto.",
        });
      }
    }

    if (!ofxResponse || typeof ofxResponse !== "object") {
      return reply.status(400).send({
        error: "Formato de arquivo OFX inválido",
      });
    }

    const transactionList =
      ofxResponse?.OFX?.BANKMSGSRSV1?.STMTTRNRS?.STMTRS?.BANKTRANLIST?.STRTTRN;
    if (!transactionList || !Array.isArray(transactionList)) {
      return reply.status(400).send({
        error: "Arquivo OFX não contém dados de transações válidos",
      });
    }

    const bankStatement = await Db.instance.bankStatement.create({
      data: {
        name: file.filename,
        userId: id,
      },
    });
    const transactions = (
      (ofxResponse?.OFX?.BANKMSGSRSV1?.STMTTRNRS?.STMTRS?.BANKTRANLIST
        ?.STRTTRN ?? []) as StatementTransaction[]
    ).map((transaction: StatementTransaction) => {
      const transactionValue = Number(transaction.TRNAMT);
      const parsedDate = parseDate(transaction.DTPOSTED as any);

      const transactionDate = parsedDate
        ? parsedDate.toISOString()
        : new Date().toISOString();

      return {
        description: transaction.MEMO || "No description",
        value: Math.abs(transactionValue),
        type: (transactionValue > 0 ? "Credit" : "Debit") as "Credit" | "Debit",
        transactionDate: transactionDate,
        fitId: transaction.FITID.toString(),
        userId: id,
        bankStatementId: bankStatement.id,
      };
    });

    if (transactions.length > 0) {
      await Db.instance.transaction.createMany({
        data: transactions,
      });
    }

    reply.status(200).send({
      message: "Arquivo processado com sucesso",
      transactionsCount: transactions.length,
    });
  } catch (error) {
    console.error("Error processing OFX file:", error);
    reply.status(500).send({
      error: "Erro ao processar arquivo OFX. Tente novamente.",
    });
  }
}

export async function getLastFiveTransactions(
  request: FastifyRequest,
  reply: FastifyReply
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

export async function updateTransaction(
  request: FastifyRequest<{
    Params: { id: string };
    Body: UpdateTransactionBody;
  }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const { description, tag, type, value, date } = request.body;

  const dateFormatted = DateTime.fromISO(date).toUTC();

  if (!dateFormatted.isValid)
    return reply.status(400).send({ message: "Date invalid" });

  const transaction = await Db.instance.transaction.findUnique({
    where: { id },
  });

  if (!transaction)
    return reply.status(404).send({ message: "Transaction not found" });

  const formattedTag = tag === "" || tag === null || tag === undefined ? null : tag;

  const updatedTransaction = await Db.instance.transaction.update({
    where: { id },
    data: {
      description,
      type: type as "Credit" | "Debit",
      value,
      transactionDate: dateFormatted.toISO(),
      tagId: formattedTag,
    },
    include: {
      tag: true,
    },
  });

  reply.status(200).send({ transaction: updatedTransaction });
}
