// schemas/ReviewSchema.js
const UserSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    username: { type: 'string' },
    email: { type: 'string' },
  },
};
const ProductSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    price: { type: 'number' },
    image: { type: 'string' }
  }
};
const ReviewSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    content: { type: 'string' },
    product_id: { type: 'number' },
    user_id: { type: 'number' },
    created_at: { type: 'string', format: 'date-time' },
    user: UserSchema,
    product: ProductSchema,
  },
};

module.exports = {
  ReviewSchema,

  create: {
    tags: ['review'],
    body: {
      type: 'object',
      required: ['content', 'product_id', 'user_id'],
      properties: {
        content: { type: 'string' },
        product_id: { type: 'number' },
        user_id: { type: 'number' },
      },
    },
    response: {
      201: ReviewSchema,
    },
  },

  getAll: {
    tags: ['review'],
    response: {
      200: {
        type: 'array',
        items: ReviewSchema,
      },
    },
  },

  getByUserId: {
    tags: ['review'],
    params: {
      type: 'object',
      required: ['user_id'],
      properties: {
        user_id: { type: 'number' },
      },
    },
    response: {
      200: {
        type: 'array',
        items: ReviewSchema,
      },
    },
  },
  getByProductId: {
    tags: ['review'],
    params: {
      type: 'object',
      required: ['product_id'],
      properties: {
        product_id: { type: 'number' },
      },
    },
    response: {
      200: {
        type: 'array',
        items: ReviewSchema,
      },
    },
  },
  delete: {
    tags: ['review'],
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'number' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  update: {
    tags: ['review'],
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'number' },
      },
    },
    body: {
      type: 'object',
      required: ['content'],
      properties: {
        content: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          content: { type: 'string' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  getOne: {
    tags: ['review'],
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'number' },
      },
    },
    response: {
      200: ReviewSchema,
    },
  },
  getByProductName: {
    tags: ['review'],
    querystring: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'content', 'product_id', 'user_id', 'created_at', 'name', 'user', 'product'],
          properties: {
            id: { type: 'number' },
            content: { type: 'string' },
            product_id: { type: 'number' },
            user_id: { type: 'number' },
            created_at: { type: 'string', format: 'date-time' },
            name: { type: 'string' },
            user: {
              type: 'object',
              required: ['username', 'email'],
              properties: {
                username: { type: 'string' },
                email: { type: 'string' },
              },
            },
            product: {
              type: 'object',
              required: ['name'],
              properties: {
                name: { type: 'string' },
              },
            },
          },
        },
      },
    }
  }



};
