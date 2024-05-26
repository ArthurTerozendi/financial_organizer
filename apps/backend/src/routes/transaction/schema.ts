import { z } from "zod";
import { buildJsonSchemas } from 'fastify-zod'

const CreateTrasactionSchema = z.object({
  description: z.string(),
  tag: z.string(),
  value: z.number(),
  data: z.date(),
  type: z.string(),
});

export type CreateTransactionBody = z.infer<typeof CreateTrasactionSchema>

export const { schemas: TransactionSchemas, $ref } = buildJsonSchemas({
  CreateTrasactionSchema
})