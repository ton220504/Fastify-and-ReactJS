const statisticHandler = require("../../handlers/statistics.handler");
const statisticSchema = require("..//statistics/schema/statistics.schema");

module.exports = function (fastify, opts, done) {

    fastify.get("/api/count/user", { schema: statisticSchema.countuser }, statisticHandler.countUserHandler);
    fastify.get("/api/count/product", { schema: statisticSchema.countproduct }, statisticHandler.countproductHandler);
    fastify.get("/api/count/brand", { schema: statisticSchema.countbrand }, statisticHandler.countBrandHandler);
    fastify.get("/api/count/category", { schema: statisticSchema.countcategory }, statisticHandler.countCategoryHandler);
    fastify.get("/api/count/topic", { schema: statisticSchema.counttopic }, statisticHandler.countTopicHandler);
    fastify.get("/api/count/post", { schema: statisticSchema.countpost }, statisticHandler.countPostHandler);
    fastify.get("/api/count/banner", { schema: statisticSchema.countbanner }, statisticHandler.countBannerHandler);
    fastify.get("/api/count/review", { schema: statisticSchema.countreview }, statisticHandler.countreviewHandler);
    fastify.get("/api/count/postcomment", { schema: statisticSchema.countpostcomment }, statisticHandler.countPostCommentHandler);

    done();
};