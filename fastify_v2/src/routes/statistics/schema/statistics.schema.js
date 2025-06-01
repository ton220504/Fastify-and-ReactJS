const StatisticSchema = {
    countuser: {
        description: 'Đếm số lượng người dùng chưa bị xóa (isDelete = 0)',
        tags: ['Statistic'],
        summary: 'Đếm người dùng còn hoạt động',
        response: {
            200: {
                type: 'object',
                properties: {
                    total_users: { type: 'number' }
                }
            },
            500: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    error: { type: 'string' },
                    message: { type: 'string' }
                }
            }
        }
    },
    countproduct: {
        description: 'Đếm số lượng sản phẩm chưa bị xóa (isDelete = 0)',
        tags: ['Statistic'],
        summary: 'Đếm sản phẩm còn hoạt động',
        response: {
            200: {
                type: 'object',
                properties: {
                    total_products: { type: 'number' }
                }
            },
            500: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    error: { type: 'string' },
                    message: { type: 'string' }
                }
            }
        }
    },
    countbrand: {
        description: 'Đếm số lượng thương hiệu chưa bị xóa (isDelete = 0)',
        tags: ['Statistic'],
        summary: 'Đếm thương còn hoạt động',
        response: {
            200: {
                type: 'object',
                properties: {
                    total_brands: { type: 'number' }
                }
            },
            500: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    error: { type: 'string' },
                    message: { type: 'string' }
                }
            }
        }
    },
    countcategory: {
        description: 'Đếm số lượng danh mục chưa bị xóa (isDelete = 0)',
        tags: ['Statistic'],
        summary: 'Đếm danh mục còn hoạt động',
        response: {
            200: {
                type: 'object',
                properties: {
                    total_categories: { type: 'number' }
                }
            },
            500: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    error: { type: 'string' },
                    message: { type: 'string' }
                }
            }
        }
    },
    counttopic: {
        description: 'Đếm số lượng chưa bị xóa (isDelete = 0)',
        tags: ['Statistic'],
        summary: 'Đếm còn hoạt động',
        response: {
            200: {
                type: 'object',
                properties: {
                    total_topics: { type: 'number' }
                }
            },
            500: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    error: { type: 'string' },
                    message: { type: 'string' }
                }
            }
        }
    },
    countpost: {
        description: 'Đếm số lượng chưa bị xóa (isDelete = 0)',
        tags: ['Statistic'],
        summary: 'Đếm còn hoạt động',
        response: {
            200: {
                type: 'object',
                properties: {
                    total_posts: { type: 'number' }
                }
            },
            500: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    error: { type: 'string' },
                    message: { type: 'string' }
                }
            }
        }
    },
    countbanner: {
        description: 'Đếm số lượng chưa bị xóa (isDelete = 0)',
        tags: ['Statistic'],
        summary: 'Đếm còn hoạt động',
        response: {
            200: {
                type: 'object',
                properties: {
                    total_banners: { type: 'number' }
                }
            },
            500: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    error: { type: 'string' },
                    message: { type: 'string' }
                }
            }
        }
    },
    countreview: {
        description: 'Đếm số lượng chưa bị xóa (isDelete = 0)',
        tags: ['Statistic'],
        summary: 'Đếm còn hoạt động',
        response: {
            200: {
                type: 'object',
                properties: {
                    total_reviews: { type: 'number' }
                }
            },
            500: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    error: { type: 'string' },
                    message: { type: 'string' }
                }
            }
        }
    },
    countpostcomment: {
        description: 'Đếm số lượng chưa bị xóa (isDelete = 0)',
        tags: ['Statistic'],
        summary: 'Đếm còn hoạt động',
        response: {
            200: {
                type: 'object',
                properties: {
                    total_postcomments: { type: 'number' }
                }
            },
            500: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    error: { type: 'string' },
                    message: { type: 'string' }
                }
            }
        }
    }
}
module.exports = StatisticSchema;