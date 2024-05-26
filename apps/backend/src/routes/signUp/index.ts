import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import { Db, Prisma } from "@financial-organizer/db";
import { $ref } from "./schema";

type SignUpBody = {
  name: string,
  password: string,
  email: string,
}

export default async function (fastify: FastifyInstance) {
  fastify.post('/', {
    schema: {
      body: $ref('SignUpSchema'),
    }
  }, async (request, reply) => {
    try {
      const { name, password, email } = request.body as SignUpBody;
      const passwordEncrypted = await bcrypt.hash(password, 10);

      await Db.instance.user.create({
        data: {
          email,
          name,
          password: passwordEncrypted,
        }
      })

      reply.status(201).send({ message: 'New user created!' });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return reply.status(409).send({
            error: 'Email already in use',
            message: 'The email you provide is already associated with another account'
          })
        }
      }
      return reply.status(500).send({
        error: 'Internal error',
        message: 'Unknown error'
      });
    }
  });
}