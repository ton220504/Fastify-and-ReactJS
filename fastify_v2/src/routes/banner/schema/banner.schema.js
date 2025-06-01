const { tags } = require("../../brand/schema/brand.getall.schema");

const bannerSchema = {
    getAll: {
        description: "Get all banners",
        tags: ["Banner"],
        response: {
            200: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                        name: { type: "string" },
                        image: { type: "string" }
                    }
                }
            }
        }
    },

    getOne: {
        tags: ["Banner"],
        description: "Get a single banner",
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
                    name: { type: "string" },
                    image: { type: "string" }
                }
            }
        }
    },

    create: {
        tags: ["Banner"],
        description: "Create a new banner",
        headers: {
            type: "object",
            properties: {
                Authorization: { type: "string" }
            },
            required: ["Authorization"]
        },

        body: {
            type: "object",
            required: ["name", "image"],
            properties: {
                name: { type: "string" },
                image: { type: "string" }
            }
        },
        response: {
            201: {
                type: "object",
                properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                    image: { type: "string" }
                }
            }
        }
    },

    update: {
        tags: ["Banner"],
        description: "Update an existing banner",
        headers: {
            type: "object",
            properties: {
                Authorization: { type: "string" }
            },
            required: ["Authorization"]
        },
        params: {
            type: "object",
            properties: { id: { type: "number" } },
            required: ["id"]
        },
        body: {
            type: "object",
            properties: {
                name: { type: "string" },
                image: { type: "string" }
            }
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" }
                }
            }
        }
    },

    remove: {
        tags: ["Banner"],
        description: "Delete a banner",
        headers: {
            type: "object",
            properties: {
                Authorization: { type: "string" }
            },
            required: ["Authorization"]
        },
        params: {
            type: "object",
            properties: { id: { type: "number" } },
            required: ["id"]
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" }
                }
            }
        }
    },
    restore: {
        tags: ['Banner'],
        summary: 'Restore Banner (isDelete = 0)',
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
                id: { type: 'integer', minimum: 1, description: 'Banner ID' }
            },
            required: ['id']
        },
        response: {
            200: {
                description: 'Banner restored successfully',
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            },
            404: {
                description: 'Banner not found',
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

module.exports = bannerSchema;
