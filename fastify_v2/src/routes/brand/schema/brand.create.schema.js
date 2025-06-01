const createBrandSchema = {
    description: 'Create a new brand',
    tags: ['brand'],
    summary: 'Create a new brand',
    headers: {
        type: "object",
        properties: {
            Authorization: { type: "string" }
        },
        required: ["Authorization"]
    },
    body: {
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string' }
        }
    },
    response: {
        201: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                id: { type: 'number' }
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
                message: 'Missing required field: name'
            }
        }
    }
};

module.exports = createBrandSchema;
