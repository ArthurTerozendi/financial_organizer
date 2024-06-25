import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTransactionBody } from "./schema";
import { Ofx } from "ofx-data-extractor";

export async function createTransaction(request: FastifyRequest<{ Body: CreateTransactionBody }>, reply: FastifyReply) {
  console.log(request.body);

  reply.status(200).send('ok');
}

export async function uploadFile(request: FastifyRequest, reply: FastifyReply) {
  const file = await request.file();

  if (file) {
   
    const data = (await file.toBuffer()).toString();
    const ofx = new Ofx(data) // works in node.js and browser
    const ofxResponse = ofx.toJson()
    console.log(ofxResponse)

    reply.status(200).send('ok');
  }
  
  reply.status(400).send({ error: 'No file uploaded' });
}