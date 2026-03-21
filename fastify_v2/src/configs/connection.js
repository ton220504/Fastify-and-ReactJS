const mysql = require('@fastify/mysql');

const mysqlConnection = async (fastify) => {
    await fastify.register(mysql, {
        //connectionString: 'mysql://root@localhost/Fastify',
        connectionString: 'mysql://root:password@mysql_db:3306/Fastify',
        
    });
};

module.exports = mysqlConnection;
