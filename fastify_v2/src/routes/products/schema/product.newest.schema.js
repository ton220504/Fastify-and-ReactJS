const getNewestSchema = {
    tags: ['Product'],
    description: 'Lấy danh sách sản phẩm mới nhất theo created_at',
    querystring: {
      type: 'object',
      properties: {
        limit: { type: 'string' }
      }
    },
    response: {
      200: {
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
      }
    }
  };
  
module.exports =  getNewestSchema 
    ;
