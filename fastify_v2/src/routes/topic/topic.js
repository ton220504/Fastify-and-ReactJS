const topicHandler = require("../../handlers/topic.handler");
const topicSchema = require("../topic/schema/topic.schema");

module.exports = function (fastify, opts, done) {
    const onRequest = [
        async (request, reply) => await fastify.authenticate(request, reply)
      ]
    fastify.get("/api/topics", { schema: topicSchema.getAll }, topicHandler.getAll);
    fastify.get("/api/topicsIsDelete", { schema: topicSchema.getAll }, topicHandler.getAllIsDelete);
    fastify.get("/api/topics/:id", { schema: topicSchema.getOne }, topicHandler.getOne);
    fastify.post("/api/topics", {onRequest, schema: topicSchema.create }, topicHandler.create);
    fastify.put("/api/topics/:id", {onRequest, schema: topicSchema.update }, topicHandler.update);
    fastify.delete("/api/topics/:id", {onRequest, schema: topicSchema.remove }, topicHandler.remove);
    fastify.delete('/api/topics/:id/soft-delete', { onRequest, schema: topicSchema.remove }, topicHandler.IsDelete);
    fastify.put('/api/topics/:id/restore', { onRequest, schema: topicSchema.restore }, topicHandler.restore);
    done();
};
