const UserSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        username: { type: 'string' },
        email: { type: 'string' },
    },
};
const PostSchema = {
    type: 'object',
    properties: {
        id: { type: "number" },
        title: { type: "string" },
        slug: { type: "string" },
        description: { type: "string" },
        detail: { type: "string" },
        image: { type: "string" },
        topic_id: { type: "number" },
        status: { type: "number" },
        created_by: { type: "number" },
        created_at: { type: "string", format: "date-time" }
    }
};
const PostCommentSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        content: { type: 'string' },
        post_id: { type: 'number' },
        user_id: { type: 'number' },
        created_at: { type: 'string', format: 'date-time' },
        user: UserSchema,
        post: PostSchema,
    },
};


const postSchema = {
    getAll: {
        description: "Get all posts",
        tags: ["Post"],
        response: {
            200: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                        title: { type: "string" },
                        slug: { type: "string" },
                        description: { type: "string" },
                        detail: { type: "string" },
                        image: { type: "string" },
                        topic_id: { type: "number" },
                        status: { type: "number" },
                        created_by: { type: "number" },
                        created_at: { type: "string", format: "date-time" }
                    }
                }
            }
        }
    },
    getPostByTopicId: {
        description: "Get posts by topic ID",
        tags: ["Post"],
        params: {
            type: "object",
            properties: {
                topic_id: { type: "number" },
            },
            required: ["topic_id"]
        },
        response: {
            200: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                        title: { type: "string" },
                        slug: { type: "string" },
                        description: { type: "string" },
                        detail: { type: "string" },
                        image: { type: "string" },
                        topic_id: { type: "number" },
                        status: { type: "number" },
                        created_by: { type: "number" },
                        created_at: { type: "string", format: "date-time" }
                    }
                }
            }
        }
    },
    getOne: {
        tags: ["Post"],
        description: "Get a single post",
        params: {
            type: "object",
            properties: { id: { type: "number" } },
            required: ["id"]
        },
        response: {
            200: {
                type: "object",
                properties: {
                    id: { type: "number" },
                    title: { type: "string" },
                    slug: { type: "string" },
                    description: { type: "string" },
                    detail: { type: "string" },
                    image: { type: "string" },
                    topic_id: { type: "number" },
                    status: { type: "number" },
                    created_by: { type: "number" },
                    created_at: { type: "string", format: "date-time" }
                }
            }
        }
    },

    create: {
        description: "Create a new post",
        tags: ["Post"],
        headers: {
            type: "object",
            properties: {
                Authorization: { type: "string" }
            },
            required: ["Authorization"]
        },
        body: {
            type: "object",
            required: ["title", "slug", "description", "detail", "image", "topic_id", "status", "created_by"],
            properties: {
                title: { type: "string" },
                slug: { type: "string" },
                description: { type: "string" },
                detail: { type: "string" },
                image: { type: "string" },
                topic_id: { type: "number" },
                status: { type: "number" },
                created_by: { type: "number" }
            }
        }
    },

    update: {
        description: "update a post",
        tags: ["Post"],
        description: "Update a topic",
        headers: {
            type: "object",
            properties: {
                Authorization: { type: "string" }
            },
            required: ["Authorization"]
        },
        params: { type: "object", properties: { id: { type: "number" } }, required: ["id"] },
        body: {
            type: "object", properties: {
                title: { type: "string" },
                slug: { type: "string" },
                description: { type: "string" },
                detail: { type: "string" },
                image: { type: "string" },
                topic_id: { type: "number" },
                status: { type: "number" },
                created_by: { type: "number" }
            }
        }
    },

    remove: {
        tags: ["Post"],
        headers: {
            type: "object",
            properties: {
                Authorization: { type: "string" }
            },
            required: ["Authorization"]
        },
        description: "Delete a post",
        params: { type: "object", properties: { id: { type: "number" } }, required: ["id"] }
    },
    createComment: {
        tags: ['Post'],
        body: {
            type: 'object',
            required: ['content', 'post_id', 'user_id'],
            properties: {
                content: { type: 'string' },
                post_id: { type: 'number' },
                user_id: { type: 'number' },
            },
        }
    },
    getByUserIdAndPostId: {
        tags: ['Post'],
        description: 'Lấy comment theo user_id và post_id',
        params: {
            type: 'object',
            required: ['user_id', 'post_id'],
            properties: {
                user_id: { type: 'number' },
                post_id: { type: 'number' },
            },
        },
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        content: { type: 'string' },
                        post_id: { type: 'number' },
                        user_id: { type: 'number' },
                        user_name: { type: 'string' },
                        user_email: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    },
    getCommentByPostId: {
        tags: ["Post"],
        description: "Lấy bình luận theo post_id",
        params: {
            type: "object",
            properties: {
                post_id: { type: "number" }
            },
            required: ["post_id"]
        },
        response: {
            200: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                        content: { type: "string" },
                        post_id: { type: "number" },
                        user_id: { type: "number" },
                        created_at: { type: "string", format: "date-time" },
                        user_name: { type: "string" },
                        user_email: { type: "string" }
                    }
                }
            }
        }
    },
    restore: {
        tags: ['Post'],
        summary: 'Restore Post (isDelete = 0)',
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
                id: { type: 'integer', minimum: 1, description: 'Post ID' }
            },
            required: ['id']
        },
        response: {
            200: {
                description: 'Post restored successfully',
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            },
            404: {
                description: 'Post not found',
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    error: { type: 'string' },
                    message: { type: 'string' }
                }
            }
        }
    }, getAllPostComment: {
        description: "Get all posts",
        tags: ["Post"],
        response: {
            200: {
            type: 'array',
            items: PostCommentSchema
        }
        }
    },removePostComment: {
        tags: ["Post"],
        headers: {
            type: "object",
            properties: {
                Authorization: { type: "string" }
            },
            required: ["Authorization"]
        },
        description: "Delete a post",
        params: { type: "object", properties: { id: { type: "number" } }, required: ["id"] }
    },

};

module.exports = postSchema;
