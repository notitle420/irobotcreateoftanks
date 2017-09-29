var mysql = require('mysql');

var dbConfig = {
  host: 'ja-cdbr-azure-east-a.cloudapp.net',
  user: 'b7a3bc88bf20a9',
  password: 'bf022b50',
  database: 'iotsql'
};

var connection = mysql.createConnection(dbConfig);

module.exports = connection;
