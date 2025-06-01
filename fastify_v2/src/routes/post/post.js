const postHandler = require("../../handlers/post.handler");
const postSchema = require("../post/schema/post.schema");

module.exports = function (fastify, opts, done) {
  const onRequest = [
    async (request, reply) => await fastify.authenticate(request, reply)
  ]
  fastify.get("/api/posts", { schema: postSchema.getAll }, postHandler.getAll);
  fastify.get("/api/postcomments", { schema: postSchema.getAllPostComment }, postHandler.getAllPostComment);

  fastify.get("/api/postsIsDelete", { schema: postSchema.getAll }, postHandler.getAllIsDelete);
  fastify.get("/api/posts/topicId/:topic_id", { schema: postSchema.getPostByTopicId }, postHandler.getPostsByTopic);
  fastify.get("/api/posts/:id", { schema: postSchema.getOne }, postHandler.getOne);
  fastify.get('/api/postsComment/user/:user_id/post/:post_id', { schema: postSchema.getByUserIdAndPostId }, postHandler.getCommentsByUserAndPost);
  fastify.get('/api/postsComment/post/:post_id', { schema: postSchema.getCommentByPostId }, postHandler.getCommentByPostId);
  fastify.post("/api/posts", { onRequest, schema: postSchema.create }, postHandler.create);
  fastify.post("/api/posts/comment", { schema: postSchema.createComment }, postHandler.createComment);

  fastify.put("/api/posts/:id", { onRequest, schema: postSchema.update }, postHandler.update);
  fastify.delete("/api/posts/:id", { onRequest, schema: postSchema.remove }, postHandler.remove);
  fastify.delete("/api/postcomment/:id", { onRequest, schema: postSchema.removePostComment }, postHandler.removePostComment);

  fastify.delete('/api/posts/:id/soft-delete', { onRequest, schema: postSchema.remove }, postHandler.IsDelete);
  fastify.put('/api/posts/:id/restore', { onRequest, schema: postSchema.restore }, postHandler.restore);
  done();
};
