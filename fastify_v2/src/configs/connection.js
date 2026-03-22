const mysql = require('@fastify/mysql');

const mysqlConnection = async (fastify) => {
    await fastify.register(mysql, {
        //connectionString: 'mysql://root@localhost/Fastify',
        //connectionString: 'mysql://root:password@mysql_db:3306/Fastify',
        connectionString: `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
        
    });
};

module.exports = mysqlConnection;
