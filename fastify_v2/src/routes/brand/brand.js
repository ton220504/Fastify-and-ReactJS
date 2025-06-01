const brandSchema = require('./schema');
const brandHandler = require('../../handlers/brand.handler');

module.exports = function (fastify, opts, done) {
  ///Authorization/////
  const onRequest = [
    async (request, reply) => await fastify.authenticate(request, reply)
  ]
  //gọi tất cả brand
  fastify.get('/api/brand', { schema: brandSchema.getAllBrandSchema }, brandHandler.getAll);
  fastify.get('/api/brandIsdelete', { schema: brandSchema.getAllBrandSchema }, brandHandler.getAllIsDelete);

  //gọi brand theo id
  fastify.get('/api/brand/:id', { schema: brandSchema.getOneBrandSchema }, brandHandler.getOne);
  // tạo brand
  fastify.post('/api/brand', { onRequest, schema: brandSchema.createBrandSchema }, brandHandler.createBrand);
  fastify.put('/api/brand/:id', { onRequest, schema: brandSchema.updateBrandSchema }, brandHandler.updateBrand);
  fastify.delete('/api/brand/:id', { onRequest, schema: brandSchema.deleteBrandSchema }, brandHandler.deleteBrand);
  fastify.delete('/api/brand/:id/soft-delete', { onRequest, schema: brandSchema.deleteBrandSchema }, brandHandler.IsDelete);
  fastify.put('/api/brand/:id/restore', { onRequest, schema: brandSchema.restoreBrandSchema }, brandHandler.restore);
  done();
};