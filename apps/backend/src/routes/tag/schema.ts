import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const CreateTagSchema = z.object({
  name: z.string(),
  color: z.string(),
  id: z.string(),
});

export type CreateTagBody = z.infer<typeof CreateTagSchema>;

export const { schemas: TagSchemas, $ref } = buildJsonSchemas(
  {
    CreateTagSchema: CreateTagSchema,
  },
  { $id: "TagSchema" }
);
