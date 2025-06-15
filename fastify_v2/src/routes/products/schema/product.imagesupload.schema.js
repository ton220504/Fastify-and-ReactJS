const imagesuploadProductSchema = {
  description: "Upload image for product",
  tags: ["Product"],

  body: {
    type: 'object',
    required: ['image_url', 'color_name', 'price'],  // Chỉ cần 3 trường này
    properties: {
      image_url: { type: 'string' },  // URL của ảnh
      color_name: { type: 'string' },  // Tên màu sắc
      price: { type: 'number' },  // Giá của sản phẩm
    }
  },
  response: {
    201: {
      type: "object",
      properties: {
        image_url: { type: 'string' },
        color_name: { type: 'string' },
        price: { type: 'number' },
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

module.exports = imagesuploadProductSchema;
