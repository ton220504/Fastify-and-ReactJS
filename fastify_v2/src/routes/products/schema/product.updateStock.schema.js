const updateStockQuantitySchema = {
  description: 'Update stock quantity of a product',
  tags: ['Product'],
  summary: 'Only update stock_quantity field',
  
  params: {
    type: 'object',
    properties: {
      id: { type: 'integer', minimum: 1, description: 'Product ID' }
    },
    required: ['id']
  },
  body: {
    type: 'object',
    required: ['stock_quantity'],
    properties: {
      stock_quantity: { type: 'integer', minimum: 0 }
    },
    additionalProperties: false
  },
  response: {
    200: {
      description: 'Stock quantity updated',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    },
    400: {
      description: 'Invalid input',
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    },
    404: {
      description: 'Product not found',
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
};

module.exports = updateStockQuantitySchema;
