const bannerHandler = require("../../handlers/banner.handler");
const bannerSchema = require("../banner/schema/banner.schema");

module.exports = function (fastify, opts, done) {
    ///Authorization/////
    const onRequest = [
        async (request, reply) => await fastify.authenticate(request, reply)
    ]

    fastify.get("/api/banners", { schema: bannerSchema.getAll }, bannerHandler.getAll);
    fastify.get("/api/bannersIsDelete", { schema: bannerSchema.getAll }, bannerHandler.getAllIsDelete);
    fastify.get("/api/banners/:id", { schema: bannerSchema.getOne }, bannerHandler.getOne);
    fastify.post("/api/banners", { onRequest, schema: bannerSchema.create }, bannerHandler.create);
    fastify.put("/api/banners/:id", { onRequest, schema: bannerSchema.update }, bannerHandler.update);
    fastify.delete("/api/banners/:id", { onRequest, schema: bannerSchema.remove }, bannerHandler.remove);
    fastify.delete('/api/banners/:id/soft-delete', { onRequest, schema: bannerSchema.remove }, bannerHandler.IsDelete);
    fastify.put('/api/banners/:id/restore', { onRequest, schema: bannerSchema.restore }, bannerHandler.restore);
    done();
};
