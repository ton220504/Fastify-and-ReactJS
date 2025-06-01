const cartHandler = require('../../handlers/cart.handler');
const cartSchema = require('..//cart/schema/cart.schema');

module.exports = function (fastify, opts, done) {
  fastify.post('/api/carts', { schema: cartSchema.create }, cartHandler.create);
  fastify.put('/api/carts/quantity', { schema: cartSchema.updateQuantity }, cartHandler.updateQuantity);
  fastify.delete('/api/carts/:id', { schema: cartSchema.remove }, cartHandler.remove);
  fastify.delete('/api/cartsItem/:cart_item_id', { schema: cartSchema.removeCart }, cartHandler.removecart);

  fastify.get('/api/carts', { schema: cartSchema.getAll }, cartHandler.getAll);
  fastify.get('/api/carts/user/:user_id', { schema: cartSchema.getByUser }, cartHandler.getByUser);
  fastify.get('/api/carts/count/:user_id', { schema: cartSchema.countCart }, cartHandler.countCartItemsHandler);

  done();
};
