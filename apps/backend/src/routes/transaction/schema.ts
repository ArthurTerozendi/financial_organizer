import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const CreateTransactionSchema = z.object({
  description: z.string(),
  tag: z.string(),
  value: z.number(),
  date: z.string(),
  type: z.string(),
});

export type CreateTransactionBody = z.infer<typeof CreateTransactionSchema>;

const UpdateTransactionSchema = z.object({

  description: z.string(),
  tag: z.string().optional(),
  value: z.number(),
  date: z.string(),
  type: z.string(),
});

export type UpdateTransactionBody = z.infer<typeof UpdateTransactionSchema>;

export const { schemas: TransactionSchemas, $ref } = buildJsonSchemas(
  {
    CreateTransactionSchema,
    UpdateTransactionSchema,
  },
  { $id: "TransactionSchema" },
);


  
