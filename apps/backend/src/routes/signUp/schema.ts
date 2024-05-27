import { z } from "zod";
import { buildJsonSchemas } from 'fastify-zod'

export const SignUpSchema = z.object({
  name: z.string({ required_error: 'Name is required', invalid_type_error: 'Name most to be a string' }),
  email: z.string({ required_error: 'Email is required', invalid_type_error: 'Email most to be a string' }),
  password: z.string({ required_error: 'Password is required', invalid_type_error: 'Password most to be a string' }),
});

export type SingUpBody = z.infer<typeof SignUpSchema>;

export const { schemas: SignUpSchemas, $ref } = buildJsonSchemas({
  SignUpSchema
}, { $id: 'SignUpSchema' });