const updateBrandSchema = {
    description: 'Update a brand',
    tags: ['brand'],
    summary: 'Update a brand',
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
            id: { type: 'number' }
        },
        required: ['id']
    },
    body: {
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                id: { type: 'number' }
            }
        },
        404: {
            type: 'object',
            properties: {
                error: { type: 'string' }
            },
            example: {
                error: 'Brand not found'
            }
        }
    }
};

module.exports = updateBrandSchema;
