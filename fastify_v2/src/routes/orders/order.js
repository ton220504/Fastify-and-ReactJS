const orderHandler = require("../../handlers/order.handler");
const orderSchema = require("../orders/schema/order.schema");

module.exports = function (fastify, opts, done) {
    ///Authorization/////


    fastify.post("/api/orders", { schema: orderSchema.create }, orderHandler.createOrder);
    fastify.get("/api/orders", { schema: orderSchema.getAll }, orderHandler.getAllOrders);
    fastify.get("/api/orders/:id", { schema: orderSchema.getById }, orderHandler.handleGetOrderById);
    fastify.put("/api/orders/:id/status", { schema: orderSchema.updateStatus }, orderHandler.handleUpdateOrderStatus);
    fastify.get("/api/orders/user/:user_id", { schema: orderSchema.getByUserId }, orderHandler.getOrdersByUserId);
    fastify.delete("/api/orders/:id", { schema: orderSchema.remove }, orderHandler.deleteOrder);

    done();
};
