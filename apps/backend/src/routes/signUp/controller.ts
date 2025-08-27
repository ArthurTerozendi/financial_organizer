import { FastifyReply, FastifyRequest } from "fastify";
import { SingUpBody } from "./schema";
import bcrypt from "bcryptjs";
import { Db, Prisma } from "@financial-organizer/db";

async function createDefaultTags(userId: string) {
  const tags = [
    { name: "Alimentação", color: "#E74C3C" },
    { name: "Transporte", color: "#FAD7A0" },
    { name: "Lazer", color: "#82E0AA" },
  ];

  await Db.instance.tag.createMany({
    data: tags.map((tag) => ({
      ...tag,
      userId,
    })),
  });
}

export async function singUp(
  request: FastifyRequest<{ Body: SingUpBody }>,
  reply: FastifyReply,
) {
  try {
    const { name, password, email } = request.body as SingUpBody;
    const passwordEncrypted = await bcrypt.hash(password, 10);

    const user = await Db.instance.user.create({
      data: {
        email,
        name,
        password: passwordEncrypted,
      },
    });

    await createDefaultTags(user.id);

    reply.status(201).send({ message: "Novo usuário criado!" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return reply.status(409).send({
          error: "Esse e-mail já está em uso",
          message:
            "O e-mail que você forneceu já está associado a outra conta",
        });
      }
    }
    return reply.status(500).send({
      error: "Internal error",
      message: "Unknown error",
    });
  }
}
