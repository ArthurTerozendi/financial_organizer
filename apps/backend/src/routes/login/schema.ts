import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const LoginSchema = z.object({
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email most to be a string",
  }),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password most to be a string",
  }),
});

export type LoginBody = z.infer<typeof LoginSchema>;

export const { schemas: LoginSchemas, $ref } = buildJsonSchemas(
  {
    LoginSchema,
  },
  { $id: "LoginSchema" },
);
