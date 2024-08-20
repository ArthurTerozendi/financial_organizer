import { z } from "zod";
import { buildJsonSchemas } from 'fastify-zod'

const GetTransactionsGroupedSchema = z.object({
  period: z.string(),
});

export type GetTransactionsGroupedBody = z.infer<typeof GetTransactionsGroupedSchema>

export const { schemas: DashboardSchemas, $ref } = buildJsonSchemas({
  GetTransactionsGroupedSchema,
}, { $id: 'DashboardSchema' })