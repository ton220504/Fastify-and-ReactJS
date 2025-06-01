const deleteProductSchema = {
    description: 'Delete a product by ID',
    tags: ['Product'],
    summary: 'Remove a product from the database',
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
    response: {
        200: {
            description: 'Product deleted successfully',
            type: 'object',
            properties: {
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

module.exports = deleteProductSchema;
