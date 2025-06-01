const getAllProductSchema = {
    description: 'Get all products',
    tags: ['Product'],
    summary: 'Retrieve a list of all products',
    querystring:{
        type: 'object',
        properties: {
            page:{type :'string', default:'1', description:'Page number of the pagination'},
            limit:{ type:'string', default:'10', description:'Number of items perpage'}
        },
        
    },
    response: {
        200: {
            type: 'object',  // ✅ Đúng: Response là object, không phải array
            properties: {
                data: {
                    type: 'array',
                    items: {
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
                            }  // ✅ Chuyển datetime(6) thành ISO 8601
                        }
                    }
                },
                meta: {
                    type: 'object',
                    properties: {
                        pagination: {
                            type: 'object',
                            properties: {
                                page: { type: 'number' },
                                pageSize: { type: 'number' },
                                pageCount: { type: 'number' },
                                total: { type: 'number' }
                            }
                        }
                    }
                }
            }
        },
        400: {
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' }
            }
        }
    }
};

module.exports = getAllProductSchema;
