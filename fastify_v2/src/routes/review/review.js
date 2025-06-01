// routes/ReviewRoute.js
const ReviewHandler = require('../../handlers/review.handler');
const ReviewSchema = require('../review/schema/review.schema');


module.exports = function (fastify, opts, done) {
  fastify.post('/api/reviews', { schema: ReviewSchema.create }, ReviewHandler.createReview);
  fastify.get('/api/reviews', { schema: ReviewSchema.getAll }, ReviewHandler.getAllReviews);
  fastify.get('/api/reviews/user/:user_id', { schema: ReviewSchema.getByUserId }, ReviewHandler.getReviewsByUserId);
  fastify.get('/api/reviews/product/:product_id', { schema: ReviewSchema.getByProductId }, ReviewHandler.getReviewsByProductIdHandler);
  fastify.put('/api/reviews/:id', { schema: ReviewSchema.update }, ReviewHandler.updateReview);
  fastify.get('/api/reviews/:id', { schema: ReviewSchema.getOne }, ReviewHandler.getOneReview);
  fastify.get('/api/reviews/search', { schema: ReviewSchema.getByProductName }, ReviewHandler.getReviewsByProductNameHandler);

  fastify.delete('/api/reviews/:id', { schema: ReviewSchema.delete }, ReviewHandler.deleteReview);
  done();
};


