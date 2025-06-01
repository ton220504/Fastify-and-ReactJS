const productHandler = require('../../handlers/product.handler');
const productShema = require('./schema');

module.exports = function (fastify, opts, done) {
  const onRequest = [
    async (request, reply) => await fastify.authenticate(request, reply)
  ]
  fastify.get('/api/products', { schema: productShema.getAllProductSchema }, productHandler.getAll);
  fastify.get('/api/productsname', { schema: productShema.getNameProductSchema }, productHandler.getNameProduct);

  fastify.get('/api/productsIsDelete', { schema: productShema.getAllProductIsDeleteSchema }, productHandler.getAllIsDelete);

  fastify.get('/api/products/:id', { schema: productShema.getOneProductSchema }, productHandler.getOne);
  fastify.post('/api/products', { onRequest, schema: productShema.createProductSchema }, productHandler.create);
  fastify.put('/api/products/:id', { onRequest, schema: productShema.updateProductSchema }, productHandler.update);
  fastify.put('/api/products/:id/stock', { schema: productShema.updateStockSchema }, productHandler.updateStock);
  fastify.delete('/api/products/:id', { onRequest, schema: productShema.deleteProductSchema }, productHandler.remove);
  fastify.delete('/api/products/:id/soft-delete', { onRequest, schema: productShema.deleteProductSchema }, productHandler.IsDelete);
  fastify.put('/api/products/:id/restore', { onRequest, schema: productShema.restoreProductSchema }, productHandler.restore);

  fastify.get('/api/products/search', { schema: productShema.searchSchema }, productHandler.searchProduct);
  fastify.get('/api/products/brand/:brand_name', { schema: productShema.getBrandName }, productHandler.getByBrandName);
  fastify.get('/api/products/category/:category_name', { schema: productShema.getCategoryName }, productHandler.getByCategoryName);
  fastify.get('/api/products/newest',{ schema: productShema.getNewest },productHandler.getNewest);

  done();
};
