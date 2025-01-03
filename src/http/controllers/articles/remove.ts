import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { Article } from "../../../database/models/article";
import { findArticleById } from "./find";
import { Types } from "mongoose";
import { ForbiddenError } from "../../../errors/forbidden-error";


export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    id: z.string().length(24),
  });

  const params = schema.parse(request.params);

  const article = await findArticleById(params.id);

  //TODO use logged user
  const user = {
    _id: new Types.ObjectId('67193aad9f457278c03296ae'),
    name:'Letícia Fanan',
  };

  if (String(article.author?.id) !== user._id.toString()) {
    throw new ForbiddenError('This article is from another author.')
  }

  await Article.findByIdAndDelete(params.id);

  return reply.status(204).send();

}