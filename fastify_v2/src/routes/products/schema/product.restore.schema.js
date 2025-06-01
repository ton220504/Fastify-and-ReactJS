const restoreProductSchema = {
  description: 'Restore a soft-deleted product',
  tags: ['Product'],
  summary: 'Restore product (isDelete = 0)',
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" }
    },
    required: ["Authorization"]
  },
  params: {
    type: 'object',
    properties: {
      id: { type: 'integer', minimum: 1, description: 'Product ID' }
    },
    required: ['id']
  },
  response: {
    200: {
      description: 'Product restored successfully',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    },
    404: {
      description: 'Product not found',
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
};

module.exports = restoreProductSchema;
