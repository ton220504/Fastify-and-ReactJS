const getOneProductSchema = {
    description: 'Get a product by ID',
    tags: ['Product'],
    summary: 'Retrieve a specific product',
    params: {
        type: 'object',
        properties: {
            id: { type: 'number' }
        },
        required: ['id']
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                brand: { type: 'string' },
                category: { type: 'string' },
                price: { type: 'number' },
                description: { type: 'string' },
                stockQuantity: { type: 'number' },
                image: { type: 'string' },

                releaseDate: {
                    type: 'string',
                    format: 'date-time',
                    description: 'ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)'
                },
                images: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            url: { type: 'string' },
                            color: { type: ['string', 'null'] }
                        },
                        required: ['url']
                    }
                }

            }
        },
        404: {
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' }
            }
        }
    }
};

module.exports = getOneProductSchema;
