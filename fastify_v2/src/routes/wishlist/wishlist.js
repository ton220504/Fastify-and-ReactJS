const wishlistHandler = require('../../handlers/wishlist.handler');
const wishlistSchema = require('../wishlist/schema/wishlist.schema');

module.exports = function (fastify, opts, done) {


  fastify.post('/api/wishlist', { schema: wishlistSchema.create }, wishlistHandler.create);
  fastify.get('/api/wishlist', { schema: wishlistSchema.getAll }, wishlistHandler.getAll);
  fastify.get('/api/wishlist/:user_id', { schema: wishlistSchema.getOne }, wishlistHandler.getOne);
  fastify.get('/api/wishlist/count/:user_id', { schema: wishlistSchema.countWishlist }, wishlistHandler.countUserWishlistHandler);

  fastify.delete('/api/wishlist/:wishlist_item_id', { schema: wishlistSchema.remove }, wishlistHandler.remove);
  done();
};
