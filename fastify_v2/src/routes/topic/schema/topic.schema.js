const topicSchema = {
    getAll: {
        description: "gettALl a new topic",
        tags: ["Topic"],
        description: "Get all topics",
        response: {
            200: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                        name: { type: "string" },
                        slug: { type: "string" },
                        description: { type: "string" },
                        sort_order: { type: "number" },
                        status: { type: "number" },
                        created_at: { type: "string", format: "date-time" }
                    }
                }
            }
        }
    },

    getOne: {
        description: "getOne a new topic",
        tags: ["Topic"],
        description: "Get a single topic",
        params: {
            type: "object",
            properties: {
                id: { type: "number" }
            },
            required: ["id"]
        },
        response: {
            200: {
                type: "object",
                properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                    slug: { type: "string" },
                    description: { type: "string" },
                    sort_order: { type: "number" },
                    status: { type: "number" },
                    created_at: { type: "string", format: "date-time" }
                }
            }
        }
    },

    create: {
        description: "Create a new topic",
        tags: ["Topic"],
        description: "Create a new topic",
        headers: {
            type: "object",
            properties: {
                Authorization: { type: "string" }
            },
            required: ["Authorization"]
        },
        body: {
            type: "object",
            required: ["name", "slug", "description", "sort_order", "status", "created_by"],
            properties: {
                name: { type: "string" },
                slug: { type: "string" },
                description: { type: "string" },
                sort_order: { type: "number" },
                status: { type: "number" },
                created_by: { type: "number" }
            }
        }
    },

    update: {
        description: "update a topic",
        tags: ["Topic"],
        headers: {
            type: "object",
            properties: {
                Authorization: { type: "string" }
            },
            required: ["Authorization"]
        },
        description: "Update a topic",
        params: { type: "object", properties: { id: { type: "number" } }, required: ["id"] },
        body: { type: "object", properties: { name: { type: "string" }, slug: { type: "string" }, description: { type: "string" }, sort_order: { type: "number" }, status: { type: "number" } } }
    },

    remove: {
        description: "delete a topic",
        tags: ["Topic"],
        headers: {
            type: "object",
            properties: {
                Authorization: { type: "string" }
            },
            required: ["Authorization"]
        },
        description: "Delete a topic",
        params: { type: "object", properties: { id: { type: "number" } }, required: ["id"] }
    },
    restore: {
        tags: ['Topic'],
        summary: 'Restore Topic (isDelete = 0)',
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
                id: { type: 'integer', minimum: 1, description: 'Topic ID' }
            },
            required: ['id']
        },
        response: {
            200: {
                description: 'Topic restored successfully',
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            },
            404: {
                description: 'Topic not found',
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    error: { type: 'string' },
                    message: { type: 'string' }
                }
            }
        }
    }
};

module.exports = topicSchema;
