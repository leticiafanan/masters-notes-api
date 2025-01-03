import { FastifyInstance } from "fastify";
import { create } from "./create";
import { list } from "./list";
import { remove } from "./remove";
import { find } from "./find";
import { update } from "./update";
import { toggleLike } from "./toggle-like";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { listMy } from "./list-my";
import { findBySlug } from "./find-by-slug";

export async function articlesRoutes(app: FastifyInstance) {
  
  app.get('/articles', list);
  app.get('/articles/:id', find);
  app.get('/articles/slug/:slug', findBySlug);
  app.patch('/articles/:id/likes', toggleLike);


  app.post('/articles',  { onRequest: verifyJWT}, create);
  app.delete('/articles/:id', { onRequest: verifyJWT}, remove);
  app.put('/articles/:id',  { onRequest: verifyJWT}, update);
  app.get('/articles/my', { onRequest: verifyJWT}, listMy)
}