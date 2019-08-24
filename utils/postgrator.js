const Postgrator = require('postgrator');
require('dotenv').config();

const migrationDirectory = 'database/migrations';

const postgrator = new Postgrator({
    migrationDirectory,
    driver: 'pg',
    host: process.env.PGHOST,
    post: process.env.PGPORT,
    database: process.env.PGDATABASE,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    schemaTable: 'schema_version'
});

module.exports = postgrator;