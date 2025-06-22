const imagesDeleteProductSchema = {
  description: "Delete image for product",
  tags: ["Product"],

  body: {
    type: 'object',
    required: ['image_id'],  // Chỉ cần trường image_id
    properties: {
      image_id: { type: 'number' },  // ID của ảnh cần xóa
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: 'string' },
        image_id: { type: 'number' },
      }
    },
    400: {
      type: "object",
      properties: {
        statusCode: { type: "number" },
        error: { type: "string" },
        message: { type: "string" }
      }
    }
  }
};

module.exports = imagesDeleteProductSchema;
