const deleteCategorySchema = {
    description: 'Delete a category',
    tags: ['category'],
    summary: 'Delete a category',
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
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        },
        404: {
            type: 'object',
            properties: {
                error: { type: 'string' }
            },
            example: {
                error: 'category not found'
            }
        }
    }
};

module.exports = deleteCategorySchema;
