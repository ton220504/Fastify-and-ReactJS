const restoreCategorySchema = {
  description: 'Restore a soft-deleted product',
  tags: ['category'],
  summary: 'Restore category (isDelete = 0)',
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
      id: { type: 'integer', minimum: 1, description: 'category ID' }
    },
    required: ['id']
  },
  response: {
    200: {
      description: 'category restored successfully',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    },
    404: {
      description: 'category not found',
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
};

module.exports = restoreCategorySchema;
