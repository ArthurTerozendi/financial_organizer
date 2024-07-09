import { Db } from "@financial-organizer/db";
import { FastifyRequest, FastifyReply } from "fastify";
import { Ofx } from "ofx-data-extractor";
import { parseDate } from "../../../utils";


async function uploadFile(request: FastifyRequest, reply: FastifyReply) {
  const file = await request.file();
  const { id } = request.user;

  if (file) {
    const data = (await file.toBuffer()).toString();
    const ofx = new Ofx(data) 
    const ofxResponse = ofx.toJson()

    const bankStatement = await Db.instance.bankStatement.create({
      data: {
        name: file.filename,
        userId: id,
      }
    })

    const transactions = ofxResponse.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STRTTRN.map((transaction) => {
      const transactionValue = Number(transaction.TRNAMT);

      return {
        description: transaction.MEMO,
        value: Math.abs(transactionValue),
        type: (transactionValue > 0 ? 'Credit' : 'Debit') as 'Credit' | 'Debit',
        transactionDate: parseDate(transaction.DTPOSTED as any) ?? '',
        fitId: transaction.FITID.toString(),
        userId: id,
        bankStatementId: bankStatement.id,
      }
    })

    await Db.instance.transaction.createMany({
      data: transactions
    });

    reply.status(200).send('ok');
  }
  
  reply.status(400).send({ error: 'No file uploaded' });
}

export default uploadFile;