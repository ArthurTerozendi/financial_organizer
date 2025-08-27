import { FastifyReply, FastifyRequest } from "fastify";
import { Db } from "@financial-organizer/db";
import { CreateTagBody } from "./schema";

export const getAllTags = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const tags = await Db.instance.tag.findMany({
    where: { userId: request.user.id },
  });
  return reply.send({ tags });
};

export const createTag = async (
  request: FastifyRequest<{ Body: CreateTagBody }>,
  reply: FastifyReply
) => {
  const { name, color, id } = request.body;

  const tag = await Db.instance.tag.create({
    data: { color, name, userId: request.user.id, id },
  });
  return reply.send({ tag });
};
