const ProductSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        price: { type: 'number' },
        image: { type: 'string' }
    }
};
const AddressSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        district: { type: 'string' },
        province: { type: 'string' },
        street: { type: 'string' },
        ward: { type: 'string' }
    }
};

const OrderItemSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        product_id: { type: 'number' },
        price: { type: 'number' },
        quantity: { type: 'number' },
        order_id: { type: 'number' },
        image: { type: 'string' },
        product: ProductSchema //
    }
};
const UserSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        email: { type: 'string' },
        phone: {type: 'string'}
        // Thêm các field khác nếu cần như phone, avatar...
    }
};

// Thêm vào cuối file (trước module.exports)
const orderSchema = {
    create: {
        description: 'Create a new order',
        tags: ['order'],
        body: {
            type: 'object',
            required: ['user_id', 'total_price', 'address', 'items'],
            properties: {
                user_id: { type: 'number' },
                total_price: { type: 'number' },
                // ✅ Trong schema body, sửa status và payment_method về kiểu chữ thường
                status: { type: 'string', enum: ['pending', 'completed', 'cancelled', 'delivered', 'paid'] },
                payment_method: { type: 'string', enum: ['cod', 'credit_card', 'paypal', 'bank_transfer', 'momo'] },

                address: {
                    type: 'object',
                    required: ['district', 'province', 'street', 'ward'], // Thêm dòng này
                    properties: {
                        district: { type: 'string' },
                        province: { type: 'string' },
                        street: { type: 'string' },
                        ward: { type: 'string' }
                    }
                },
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['product_id', 'price', 'quantity'], // Thêm dòng này
                        properties: {
                            product_id: { type: 'number' },
                            price: { type: 'number' },
                            quantity: { type: 'number' },
                            image: { type: 'string' }
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
                    status: { type: 'string' },
                    address: AddressSchema,  // Sửa từ $ref sang schema trực tiếp
                    items: {
                        type: 'array',
                        items: OrderItemSchema  // Sửa từ $ref sang schema trực tiếp
                    },
                    created_at: { type: 'string', format: 'date-time' }, // Thêm vào
                    payment_method: { type: 'string' } // Nên thêm nếu chưa có
                }
            }
        }
    },

    getAll: {
        tags: ['order'],
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        user_id: { type: 'number' },
                        total_price: { type: 'number' },
                        status: { type: 'string' },
                        payment_method: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        address: AddressSchema,
                        items: {
                            type: 'array',
                            items: OrderItemSchema
                        },
                        user: UserSchema // 🔥 Thêm dòng này
                    }
                }
            }
        }
    },


    getByUserId: {
        tags: ['order'],
        params: {
            type: 'object',
            required: ['user_id'],
            properties: {
                user_id: { type: 'number' }
            }
        },
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        user_id: { type: 'number' },
                        total_price: { type: 'number' },
                        status: { type: 'string' },
                        payment_method: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        address: AddressSchema,
                        items: {
                            type: 'array',
                            items: OrderItemSchema
                        }
                    }
                }
            }
        }
    },

    remove: {
        tags: ['order'],
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'number' }
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
    getById: {
        tags: ['order'],
        summary: 'Lấy đơn hàng theo ID',
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'number' }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    user_id: { type: 'number' },
                    total_price: { type: 'number' },
                    status: { type: 'string' },
                    payment_method: { type: 'string' },
                    created_at: { type: 'string', format: 'date-time' },
                    address: AddressSchema,
                    items: {
                        type: 'array',
                        items: OrderItemSchema
                    },
                    user: UserSchema
                }
            }
        }
    },
    updateStatus: {
        tags: ['order'],
        summary: 'Cập nhật trạng thái đơn hàng',
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'number' }
            }
        },
        body: {
            type: 'object',
            required: ['status'],
            properties: {
                status: {
                    type: 'string',
                    enum: ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELED', 'PAID']
                }
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

module.exports = orderSchema;