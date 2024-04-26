import { FastifyInstance } from "fastify";
import bcrypt from 'bcrypt';
import { Db } from "../../../../../packages/db";

type SignInBody = {
  name: string,
  password: string,
  email: string,
}

const SignInSchema = {
  name: { type: 'string' },
  password: { type: 'string' },
  email: { type: 'string' }
}

export default async function(fastify: FastifyInstance) {
  fastify.post('/', {
    schema: {
      body: SignInSchema,
    }
  }, async (request, reply) => {
    const { name, password, email } = request.body as SignInBody;
    const passwordEncrypted = await bcrypt.hash(password, 10);

    const newUser = Db.instance.user.create({
      data: {
        email,
        name,
        password: passwordEncrypted,
      }
    })

    reply.status(200).send({ user: newUser });
  });
}