const updateProductSchema = {
    description: 'Update an existing product',
    tags: ['Product'],
    summary: 'Modify details of an existing product',
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
            id: { type: 'integer', minimum: 1, description: 'Product ID' }
        },
        required: ['id']
    },
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            brand: { type: 'string' },
            category: { type: 'string' },
            price: { type: 'number', minimum: 0 },
            description: { type: 'string' },
            stock_quantity: { type: 'integer', minimum: 0 },
            image: { type: 'string', description: 'Image file name' },
            release_date: { type: 'string', format: 'date-time' },
            product_available: { type: 'boolean', description: 'Availability of the product' }
        },
        additionalProperties: false
    },
    response: {
        200: {
            description: 'Product updated successfully',
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        },
        400: {
            description: 'Invalid input data',
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' }
            }
        },
        404: {
            description: 'Product not found',
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' }
            }
        }
    }
};

module.exports = updateProductSchema;
