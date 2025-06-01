const UsersHandler = require("../../handlers/users.handler");
const UsersSchema = require("../users/schema/users.schema");

module.exports = function (fastify, opts, done) {
    const onRequest = [
        async (request, reply) => await fastify.authenticate(request, reply)
      ]
    // fastify.get("/topics", { schema: topicSchema.getAll }, topicHandler.getAll);
    fastify.get("/api/users", { schema: UsersSchema.getAll }, UsersHandler.getAll);
    fastify.get("/api/users/:id", { schema: UsersSchema.getOne }, UsersHandler.getOne);
    fastify.put("/api/users/:id", { schema: UsersSchema.update }, UsersHandler.updateUser);
    fastify.put("/api/users/:id/password", { schema: UsersSchema.changePassword }, UsersHandler.changePasswordHandler);
    fastify.put("/api/users/:id/createpassword", { schema: UsersSchema.createPassword }, UsersHandler.createPasswordHandler);

    fastify.delete("/api/users/:id", {onRequest, schema: UsersSchema.deleteUser }, UsersHandler.deleteUser);

    fastify.post("/api/users", { schema: UsersSchema.create }, UsersHandler.createUser);
    fastify.post("/api/users/login", { schema: UsersSchema.login }, UsersHandler.login);
    // fastify.put("/topics/:id", { schema: topicSchema.update }, topicHandler.update);
    // fastify.delete("/topics/:id", { schema: topicSchema.remove }, topicHandler.remove);
    done();
};
