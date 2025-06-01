const createProductSchema = {
    description: "Create a new product",
    tags: ["Product"],
    summary: "Add a new product to the database",
    headers: {
        type: "object",
        properties: {
            Authorization: { type: "string" }
        },
        required: ["Authorization"]
    },
    body: {
        type: "object",
        required: ["name", "brand", "category", "price", "description", "stock_quantity", "image", "release_date", "product_available"],
        properties: {
            name: { type: "string" },
            brand: { type: "string" },
            category: { type: "string" },
            price: { type: "number" },
            description: { type: "string" },
            stock_quantity: { type: "number" },
            image: { type: "string", description: "Image file name" },
            release_date: {
                type: "string",
                format: "date-time",
                description: "ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)"
            },
            product_available: { type: "boolean", description: "Product availability status" }
        }
    },
    response: {
        201: {
            type: "object",
            properties: {
                id: { type: "number" },
                name: { type: "string" },
                brand: { type: "string" },
                category: { type: "string" },
                price: { type: "number" },
                description: { type: "string" },
                stock_quantity: { type: "number" },
                image: { type: "string", description: "Image file name" },
                release_date: {
                    type: "string",
                    format: "date-time",
                    description: "ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)"
                },
                product_available: { type: "boolean", description: "Product availability status" }
            }
        },
        400: {
            type: "object",
            properties: {
                statusCode: { type: "number" },
                error: { type: "string" },
                message: { type: "string" }
            }
        }
    }
};

module.exports = createProductSchema;
