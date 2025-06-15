const mysql = require('@fastify/mysql');

const mysqlConnection = async (fastify) => {
    await fastify.register(mysql, {
        connectionString: 'mysql://root@localhost/Fastify',
        
    });
};

module.exports = mysqlConnection;
