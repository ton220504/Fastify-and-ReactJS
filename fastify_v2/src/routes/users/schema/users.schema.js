const UsersSchema = {
    create: {
        description: 'Create a new user',
        tags: ['user'],
        summary: 'Create a new user',
        body: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                username: { type: 'string' },
                email: { type: 'string', format: 'email' },
                password: { type: 'string', minLength: 8 },
                address: { type: 'string' },
                phone: { type: 'string' },
                role: { type: 'string' },
                // created_at: {
                //     type: "string",
                //     format: "date-time",
                //     description: "ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)"
                // },

            },
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    username: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    address: { type: 'string' },
                    phone: { type: 'string' },
                    created_at: { type: 'string', format: 'date-time' },
                    role: { type: 'string' },

                }
            }
        }
    },
    getOne: {
        description: 'Get a user by ID',
        tags: ['user'],
        summary: 'Retrieve user details by their ID',
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
                    id: { type: 'number' },
                    role: { type: 'string' },
                    username: { type: 'string' },
                    email: { type: 'string' },
                    address: { type: 'string' },
                    phone: { type: 'string' },
                    password: { type: 'string' },


                }
            },
            404: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
            }
        }
    },
    login: {
        description: "User login",
        tags: ["user"],
        summary: "Authenticate user and return JWT token",
        body: {
            type: "object",
            required: ["email", "password"],
            properties: {
                email: { type: "string", format: "email", description: "User's email" },
                password: { type: "string", minLength: 8, description: "User's password" },
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    jwt: { type: "string", description: "JWT authentication token" },
                    user: {
                        type: "object",
                        properties: {
                            id: { type: "number" },
                            username: { type: "string" },
                            phone: { type: "string" },
                            email: { type: "string", format: "email" },
                            role: { type: "string" },
                        }
                    }
                }
            },
            400: {
                type: "object",
                properties: {
                    statusCode: { type: "number" },
                    error: { type: "string" },
                    message: { type: "string" }
                }
            },
            401: {
                type: "object",
                properties: {
                    error: { type: "string" },
                    message: { type: "string" }
                }
            },
            500: {
                type: "object",
                properties: {
                    error: { type: "string" },
                    message: { type: "string" }
                }
            }
        }
    }, getAll: {
        description: "gettALl a new user",
        tags: ["user"],
        description: "Get all user",
        response: {
            200: {
                type: "array",
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        role: { type: 'string' },
                        username: { type: 'string' },
                        email: { type: 'string' },
                        address: { type: 'string' },
                        phone: { type: 'string' },
                        password: { type: 'string' },
                    }
                }
            }
        }
    }, update: {
        description: 'Cập nhật thông tin người dùng',
        tags: ['user'],
        summary: 'Cập nhật người dùng theo ID',
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
            required: ['email'],
            properties: {
                username: { type: 'string' },
                email: { type: 'string', format: 'email' },
                password: { type: 'string', minLength: 8 },
                address: { type: 'string' },
                phone: { type: 'string' },
                role: { type: 'string' }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    user: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            username: { type: 'string' },
                            email: { type: 'string' },
                            address: { type: 'string' },
                            phone: { type: 'string' },
                            role: { type: 'string' }
                        }
                    }
                }
            }
        }
    },

    deleteUser: {
        description: 'xóa thông tin người dùng',
        tags: ['user'],
        summary: 'xóa người dùng theo ID',
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
            }
        }
    }, changePassword: {
        description: 'Thay đổi mật khẩu người dùng',
        tags: ['user'],
        summary: 'Đổi mật khẩu (phải nhập đúng mật khẩu cũ)',
        
        params: {
            type: 'object',
            properties: {
                id: { type: 'number' }
            },
            required: ['id']
        },
        body: {
            type: 'object',
            required: ['oldPassword', 'newPassword'],
            properties: {
                oldPassword: { type: 'string', minLength: 8 },
                newPassword: { type: 'string', minLength: 8 }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    }, createPassword: {
        description: 'Thêm mật khẩu',
        tags: ['user'],
        summary: 'thêm mật khẩu',
        params: {
            type: 'object',
            properties: {
                id: { type: 'number' }
            },
            required: ['id']
        },
        body: {
            type: 'object',
            required: ['createPassword'],
            properties: {
                createPassword: { type: 'string', minLength: 8 },
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    }


};

module.exports = UsersSchema;