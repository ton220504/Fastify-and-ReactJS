const CartItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    product_id: { type: 'number' },
    price: { type: 'number' },
    quantity: { type: 'number' },
    total_price: { type: 'number' },
    cart_id: { type: 'number' },
    image: { type: 'string' },
    color:{type:'string'}
  }
};

const cartSchema = {
  create: {
    tags: ['cart'],
    description: 'Create a new cart with items',
    body: {
      type: 'object',
      required: ['user_id', 'items'],
      properties: {
        user_id: { type: 'number' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            required: ['product_id', 'quantity', 'price'],
            properties: {
              product_id: { type: 'number' },
              quantity: { type: 'number' },
              price: { type: 'number' },
              image:{type:'string'}
            }
          }
        }
      }
    },
    response: {
      201: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          user_id: { type: 'number' },
          total_price: { type: 'number' },
          items: {
            type: 'array',
            items: CartItemSchema
          }
        }
      }
    }
  },

  countCart: {
    description: 'Đếm số lượng sản phẩm trong cart theo user_id',
    tags: ['cart'],
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
  updateQuantity: {
    tags: ['cart'],
    body: {
      type: 'object',
      required: ['cart_item_id', 'quantity'],
      properties: {
        cart_item_id: { type: 'number' },
        quantity: { type: 'number' }
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
  },

  remove: {
    tags: ['cart'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'number' }
      }
    }
  },

  removeCart: {
    tags: ['cart'],
    params: {
      type: 'object',
      properties: {
        cart_item_id: { type: 'number' }
      },
      required: ['cart_item_id']
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }
  },
  

  getAll: {
    tags: ['cart'],
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            user_id: { type: 'number' },
            total_price: { type: 'number' }
          }
        }
      }
    }
  },

  getByUser: {
    tags: ['cart'],
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
          total_price: { type: 'number' },
          items: {
            type: 'array',
            items: CartItemSchema
          }
        }
      }
    }
  }
};

module.exports = cartSchema;
