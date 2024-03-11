const mariadb = require('mariadb');
require('dotenv').config();

const DATABASE_CONFIG = {
  host: process.env.MARIADB_HOST,
  port: process.env.MARIADB_PORT,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  timezone: 'Europe/Berlin',
};

async function fetchNewConnection() {
  return await mariadb.createConnection(DATABASE_CONFIG);
}

module.exports = {
  fetchNewConnection,
};

