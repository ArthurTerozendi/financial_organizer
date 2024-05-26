import { Db } from "@financial-organizer/db";
import { FastifyInstance } from "fastify";
import bcrypt from 'bcrypt';
import jsonwebtoken from "jsonwebtoken";
import { $ref } from "./schema";

type LoginBody = {
  password: string,
  email: string,
}

export default async function(fastify: FastifyInstance) {
  fastify.post('/', {
    schema: {
      body: $ref('LoginSchema'),
    }
  }, async (request, reply) => {
    const { password, email } = request.body as LoginBody;

    const user = await Db.instance.user.findUnique({
      where: {
        email
      }
    })

    if(!user) {
      return reply.status(404).send({ message: 'Wrong email', status: 'NOT_FOUND' });
    }

    const isRightPassword =  bcrypt.compareSync(password, user.password);

    if (!isRightPassword) {
      return reply.status(404).send({ message: 'Wrong password', status: 'BAD_REQUEST' });
    }

    const token = jsonwebtoken.sign(
      { user: JSON.stringify(user) },
      'private_key',
      { expiresIn: '7d' }
    )

    reply.status(200).send({ token });
  });
}