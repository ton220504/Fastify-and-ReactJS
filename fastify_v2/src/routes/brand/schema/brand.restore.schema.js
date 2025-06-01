const restoreBrandSchema = {
  description: 'Restore a soft-deleted product',
  tags: ['brand'],
  summary: 'Restore brand (isDelete = 0)',
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
      id: { type: 'integer', minimum: 1, description: 'brand ID' }
    },
    required: ['id']
  },
  response: {
    200: {
      description: 'brand restored successfully',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    },
    404: {
      description: 'brand not found',
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
};

module.exports = restoreBrandSchema;
