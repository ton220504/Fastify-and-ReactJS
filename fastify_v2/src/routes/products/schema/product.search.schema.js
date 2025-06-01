// src/schemas/product.schema.js

const searchSchema = {
    description: 'Search products by name with pagination',
    tags: ['Product'],
    querystring: {
        type: 'object',
        properties: {
            searchTerm: { type: 'string' },  // Từ khóa tìm kiếm
            page: { type: 'integer', default: 1, minimum: 1 },  // Trang, mặc định là 1
            limit: { type: 'integer', default: 10, minimum: 1, maximum: 100 },  // Giới hạn số lượng sản phẩm mỗi trang
        },
        required: ['searchTerm'],  // `searchTerm` là bắt buộc
    },
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            name: { type: 'string' },
                            brand: { type: 'string' },
                            category: { type: 'string' },
                            price: { type: 'number' },
                            description: { type: 'string' },
                            stock_quantity: { type: 'integer' },
                            image: { type: 'string' },
                            release_date: { type: 'string' },
                            product_available: { type: 'boolean' }
                        }
                    }
                },
                meta: {
                    type: 'object',
                    properties: {
                        pagination: {
                            type: 'object',
                            properties: {
                                page: { type: 'integer' },
                                pageSize: { type: 'integer' },
                                pageCount: { type: 'integer' },
                                total: { type: 'integer' }
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = searchSchema

