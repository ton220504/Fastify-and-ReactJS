
const getOneCategorySchema = {
    params: {
        type: 'object',
        properties: {
            id: { type: 'integer' }  // Đảm bảo ID là số nguyên
        },
        required: ['id']
    },
    description: 'Get one category',
    tags: ['category'],
    summary: 'Get one category',
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                name: { type: 'string' }
            }
        }, 
        400: {
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' }
            },
            example: {
                statusCode: 400,
                error: 'Bad request',
                message: 'Invalid query parameters'
            }
        }
    }
}


module.exports = getOneCategorySchema;