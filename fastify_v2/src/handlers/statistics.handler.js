const StatisticService = require('../services/statistics.service');

const countUserHandler = async (req, reply) => {
    try {
        const total_users = await StatisticService.countUser(req.server.mysql);
        return { total_users };
    } catch (error) {
        req.log.error(error);
        return reply.code(500).send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Không thể đếm người dùng'
        });
    }
};
const countproductHandler = async (req, reply) => {
    try {
        const total_products = await StatisticService.countProduct(req.server.mysql);
        return { total_products };
    } catch (error) {
        req.log.error(error);
        return reply.code(500).send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Không thể đếm sản phẩm'
        });
    }
};
const countBrandHandler = async (req, reply) => {
    try {
        const total_brands = await StatisticService.countbrand(req.server.mysql);
        return { total_brands };
    } catch (error) {
        req.log.error(error);
        return reply.code(500).send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Không thể đếm brand'
        });
    }
};
const countCategoryHandler = async (req, reply) => {
    try {
        const total_categories = await StatisticService.countcategory(req.server.mysql);
        return { total_categories };
    } catch (error) {
        req.log.error(error);
        return reply.code(500).send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Không thể đếm category'
        });
    }
};
const countTopicHandler = async (req, reply) => {
    try {
        const total_topics = await StatisticService.counttopic(req.server.mysql);
        return { total_topics };
    } catch (error) {
        req.log.error(error);
        return reply.code(500).send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Không thể đếm category'
        });
    }
};
const countPostHandler = async (req, reply) => {
    try {
        const total_posts = await StatisticService.countpost(req.server.mysql);
        return { total_posts };
    } catch (error) {
        req.log.error(error);
        return reply.code(500).send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Không thể đếm post'
        });
    }
};
const countBannerHandler = async (req, reply) => {
    try {
        const total_banners = await StatisticService.countbanner(req.server.mysql);
        return { total_banners };
    } catch (error) {
        req.log.error(error);
        return reply.code(500).send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Không thể đếm post'
        });
    }
};
const countreviewHandler = async (req, reply) => {
    try {
        const total_reviews = await StatisticService.countreview(req.server.mysql);
        return { total_reviews };
    } catch (error) {
        req.log.error(error);
        return reply.code(500).send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Không thể đếm post'
        });
    }
};
const countPostCommentHandler = async (req, reply) => {
    try {
        const total_postcomments = await StatisticService.countpostcomment(req.server.mysql);
        return { total_postcomments };
    } catch (error) {
        req.log.error(error);
        return reply.code(500).send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Không thể đếm post'
        });
    }
};
module.exports = {
    countUserHandler,
    countproductHandler,
    countBrandHandler,
    countCategoryHandler,
    countTopicHandler,
    countPostHandler,
    countBannerHandler,
    countPostCommentHandler,
    countreviewHandler
};