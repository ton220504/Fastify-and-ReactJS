const WishlistItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    product_id: { type: 'number' },
    wishlist_id: { type: 'number' },
  },
};

const wishlistSchema = {
  create: {
    tags: ['wishlist'],
    body: {
      type: 'object',
      required: ['user_id', 'product_id'],
      properties: {
        user_id: { type: 'number' },
        product_id: { type: 'number' }
      }
    },
    response: {
      201: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }
  },

  getAll: {
    tags: ['wishlist'],
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            user_id: { type: 'number' }
          }
        }
      }
    }
  },

  getOne: {
    tags: ['wishlist'],
    params: {
      type: 'object',
      properties: {
        user_id: { type: 'number' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          user_id: { type: 'number' },
          items: {
            type: 'array',
            items: WishlistItemSchema
          }
        }
      }
    }
  },
  countWishlist: {
    description: 'Đếm số lượng sản phẩm trong wishlist theo user_id',
    tags: ['wishlist'],
    params: {
      type: 'object',
      required: ['user_id'],
      properties: {
        user_id: { type: 'integer', minimum: 1 }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          count: { type: 'integer' }
        }
      }
    }
  },

  remove: {
    tags: ['wishlist'],
    params: {
      type: 'object',
      properties: {
        wishlist_item_id: { type: 'number' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }
  }
};

module.exports = wishlistSchema;
