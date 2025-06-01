const categorySchema = require('./schema');
const categoryHandler = require('../../handlers/category.handler');

module.exports = function (fastify, opts, done) {
  ///Authorization/////
  const onRequest = [
    async (request, reply) => await fastify.authenticate(request, reply)
  ]
  //gọi tất cả brand
  fastify.get('/api/category', { schema: categorySchema.getAllCategorySchema }, categoryHandler.getAll);
  fastify.get('/api/categoryIsDelete', { schema: categorySchema.getAllCategorySchema }, categoryHandler.getAllIsDelete);

  //gọi brand theo id
  fastify.get('/api/category/:id', { schema: categorySchema.getOneCategorySchema }, categoryHandler.getOne);
  // tạo brand
  fastify.post('/api/category', { onRequest, schema: categorySchema.createCategorySchema }, categoryHandler.createCategory);
  fastify.put('/api/category/:id', { onRequest, schema: categorySchema.updateCategorySchema }, categoryHandler.updateCategory);
  fastify.delete('/api/category/:id', { onRequest, schema: categorySchema.deleteCategorySchema }, categoryHandler.deleteCategory);
  fastify.delete('/api/category/:id/soft-delete', { onRequest, schema: categorySchema.deleteCategorySchema }, categoryHandler.IsDelete);
  fastify.put('/api/category/:id/restore', { onRequest, schema: categorySchema.restoreCategorySchema }, categoryHandler.restore);
  done();
};