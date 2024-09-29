import { FastifyReply, FastifyRequest } from "fastify";
import { LoginBody } from "./schema";
import { Db } from "@financial-organizer/db";
import bcrypt from "bcrypt";

export async function login(
  req: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply,
) {
  const { password, email } = req.body;

  const user = await Db.instance.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return reply
      .status(404)
      .send({ message: "Wrong email", status: "NOT_FOUND" });
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);

  if (!isValidPassword) {
    return reply
      .status(404)
      .send({ message: "Wrong password", status: "BAD_REQUEST" });
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const token = req.jwt.sign(payload, { expiresIn: "7d" });

  reply.status(200).send({ token });
}
