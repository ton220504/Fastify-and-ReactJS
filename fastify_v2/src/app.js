// Require the framework and instantiate it

// ESM

// CommonJs
const fastify = require('fastify')({
    logger: true
})
const cors = require('@fastify/cors');
require('dotenv').config();
var path = require('path');
global.appRoot = path.resolve(__dirname);
fastify.register(require('@fastify/multipart'));
const fastifyStatic = require('@fastify/static');
const fs = require('fs');
const mysqlConnection = require('./configs/connection');
mysqlConnection(fastify);
// ✅ Đăng ký middleware phục vụ file tĩnh
// Cấu hình phục vụ file tĩnh
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
fastify.register(fastifyStatic, {
    root: path.join(global.appRoot, 'uploads'), // 📂 Trỏ tới thư mục chứa ảnh
    prefix: '/uploads/', // 🏷️ Định nghĩa URL prefix
    setHeaders: (res, path, stat) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
});

/////////////////AUthorization//////////////////
const jwt = require('jsonwebtoken');
fastify.decorate("authenticate", async function (request, reply) {
    const authorization = request.headers.authorization;

    // ❌ Nếu không có header Authorization, trả về 401
    if (!authorization) {
        return reply.code(401).send({ error: "Unauthorized" });
    }

    // ❌ Nếu Authorization không có dạng "Bearer <token>", trả về 401
    const token = authorization.split(" ")[1];
    if (!token) {
        return reply.code(401).send({ error: "Unauthorized" });
    }

    try {
        const secretKey = process.env.JWT_SECRET_KEY;
        request.user = jwt.verify(token, secretKey);
    } catch (err) {
        return reply.code(401).send({ error: "Unauthorized" });
    }
});


// fastify.register(require('@fastify/cors'), {
//     origin: "*", // Cho phép tất cả origin (có thể giới hạn lại nếu cần)
//     methods: ["GET", "POST", "PUT", "DELETE"], // Chỉ định các method được phép
//     allowedHeaders: ["Content-Type", "Authorization"],
//     exposedHeaders: ["Authorization"],
//     credentials: true
// });
await fastify.register(require('@fastify/cors'), {
    origin: [
        "http://localhost:5173",
        "https://fastify-and-react-js.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
})
// Đăng ký Swagger
fastify.register(require('@fastify/swagger'), {
    routePrefix: '/docs',
    swagger: {
        info: {
            title: 'Test API',
            description: 'Testing the Fastify swagger API',
            version: '0.1.0'
        },
        servers: [
            { url: 'http://localhost:3001', description: 'Development server' }
        ],
        schemes: ['http'], // Chỉ định rõ HTTP
        consumes: ['application/json'],
        produces: ['application/json'],

    },
    exposeRoute: true
});
// Đăng ký Swagger UI
fastify.register(import('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false
    },
    uiHooks: {
        onRequest: function (request, reply, next) { next() },
        preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true
})
// Declare a route
fastify.get('/', function (request, reply) {
    reply.send({ hello: 'worldddd' })
})
fastify.get('/hello', {
    schema: {
        description: 'Lấy thông tin chào mừng',
        tags: ['Example'],
        summary: 'Trả về lời chào',
        response: {
            200: {
                description: 'Thành công',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                message: { type: 'string' }
                            }
                        }
                    }
                }
            }
        }
    }
}, async (request, reply) => {
    return { message: 'Xin chào từ Fastify!' };
});

//import brand server
fastify.register(require('./routes/brand/brand'));
//import product
fastify.register(require('./routes/products/product'));

//import upload
fastify.register(require('./routes/upload/upload'));
//import category
fastify.register(require('./routes/category/category'));
//import topic
fastify.register(require('./routes/topic/topic'));
//import post
fastify.register(require('./routes/post/post'));
//import banner
fastify.register(require('./routes/banner/banner'));
//import Users
fastify.register(require('./routes/users/users'));
//import orders
fastify.register(require('./routes/orders/order'));
//import reviws
fastify.register(require('./routes/review/review'));
//import cart
fastify.register(require('./routes/cart/cart'));
//import cart
fastify.register(require('./routes/wishlist/wishlist'));
//import Statistic
fastify.register(require('./routes/statistics/statistics'));

// Run the server!
// fastify.listen({ port: 3000 }, function (err, address) {
//     if (err) {
//         fastify.log.error(err)
//         process.exit(1)
//     }
//     // Server is now listening on ${address}
// })
const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: "0.0.0.0" })
        console.log("Server running")
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()

//////////////////////////////////////////////////
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const usersService = require('./services/users.service');
const sendOtpEmail = require('./utils/sendOtpEmail');

//login google
fastify.post('/auth/google', async (request, reply) => {
    const { token } = request.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, role, created_at } = payload;
        let newCreated_at = created_at ? new Date(created_at).toISOString() : new Date().toISOString();
        let user = await usersService.findUserByEmail(fastify.mysql, email);

        if (!user) {
            const newUser = {
                username: name,
                email: email,
                role: 'user',
                created_at: newCreated_at,

            };

            const userId = await usersService.createUserGG(fastify.mysql, newUser);
            user = { id: userId, ...newUser };
        }

        const tokenJWT = jwt.sign(
            { id: user.id, name: user.username },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '2h' }
        );

        return reply.send({
            jwt: tokenJWT,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });


    } catch (error) {
        console.error(error);
        return reply.code(401).send({ message: "Authentication failed" });
    }
});
/// đổi mật khẩu
fastify.post('/forgot-password', async (request, reply) => {
    const { email } = request.body;
    try {
        const user = await usersService.findUserByEmail(fastify.mysql, email);
        if (!user) {
            return reply.code(404).send({ message: "Email không tồn tại" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // random 6 số

        // Lưu OTP và email tạm thời
        await usersService.saveOtp(fastify.mysql, email, otp);

        // Gửi email
        await sendOtpEmail(email, otp);

        return reply.send({ message: "OTP đã được gửi đến email của bạn." });

    } catch (error) {
        console.error(error);
        return reply.code(500).send({ message: "Có lỗi xảy ra." });
    }
});
fastify.post('/verify-otp', async (request, reply) => {
    const { email, otp } = request.body;
    try {
        const isValid = await usersService.verifyOtp(fastify.mysql, email, otp);
        if (!isValid) {
            return reply.code(400).send({ message: "OTP không đúng hoặc đã hết hạn." });
        }

        return reply.send({ message: "OTP hợp lệ, cho phép đổi mật khẩu." });

    } catch (error) {
        console.error(error);
        return reply.code(500).send({ message: "Có lỗi xảy ra." });
    }
});
const bcrypt = require('bcrypt');

fastify.post('/reset-password', async (request, reply) => {
    const { email, newPassword } = request.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await usersService.updatePassword(fastify.mysql, email, hashedPassword);

        return reply.send({ message: "Đổi mật khẩu thành công." });

    } catch (error) {
        console.error(error);
        return reply.code(500).send({ message: "Có lỗi xảy ra." });
    }
});


//////////////
const express = require("express");
const app = express();
const axios = require("axios");

fastify.post("/payment", async (req, res) => {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters
    const total = req.body.total;

    if (!total || isNaN(total)) {
        return res.status(400).send({ message: "Số tiền không hợp lệ" });
    }

    var amount = total.toString(); // Chuyển sang chuỗi để dùng trong chữ ký
    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';
    var redirectUrl = 'http://localhost:3001/callback';
    var ipnUrl = 'http://localhost:3001';
    var requestType = "payWithMethod";
    //var amount = '50000';
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = '';
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature
    });
    // option for axios
    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody),
        },
        data: requestBody
    };

    let result;
    try {
        result = await axios(options);
        return res.code(200).send(result.data);
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "server error"
        });

    }
})
////////////////////gọi webhook//////////////////
const { getStock } = require("./services/product.service")
require('intl');
require('intl/locale-data/jsonp/vi');
fastify.post('/webhook', async (request, reply) => {
    let { product } = request.body.queryResult.parameters;
    const intentName = request.body.queryResult.intent.displayName;

    if (product.includes('|')) {
        product = product.split('|')[0].trim();
    }

    try {
        const productData = await getStock(fastify.mysql, product);

        if (!productData) {
            return reply.send({ fulfillmentText: `Rất tiếc, chúng tôi không tìm thấy sản phẩm ${product}.` });
        }

        let responseText = '';

        if (intentName === 'CheckStock') {
            if (productData.stock_quantity > 0) {
                responseText = `Hiện tại còn ${productData.stock_quantity} chiếc ${productData.name}.`;
            } else {
                responseText = `Rất tiếc, ${productData.name} hiện đang hết hàng.`;
            }
        } else if (intentName === 'CheckPrice') {
            // Chuyển giá sang number trước
            const priceNumber = Number(productData.price);
            const formattedPrice = priceNumber.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

            responseText = `Giá của ${productData.name} hiện tại là ${formattedPrice}.`;
        } else {
            responseText = 'Mình chưa hiểu câu hỏi của bạn, bạn có thể hỏi lại không?';
        }

        return reply.send({ fulfillmentText: responseText });
    } catch (error) {
        fastify.log.error(error);
        return reply.send({ fulfillmentText: 'Lỗi truy vấn dữ liệu, vui lòng thử lại sau.' });
    }
});


