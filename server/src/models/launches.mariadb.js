const mariadb = require('mariadb/callback');
require('dotenv').config();

const DATABASE_CONFIG = {
  host: process.env.MARIADB_HOST,
  port: process.env.MARIADB_PORT,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  timezone: 'Europe/Berlin',
  skipSetTimezone: true
};

function fetchNewConnection() {
  const connection = mariadb.createConnection(DATABASE_CONFIG);
  connection.connect(err => {
    if (err) {
      console.error('connection error: ', err);
    } else {
      console.log('connection established, id: ', connection.threadId);
    };
  });
  return connection;
}

module.exports = {
  fetchNewConnection,
};

