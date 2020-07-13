const Mariadb = require('mariadb');
const Config = require('../../config');
const Logger = require('../helper/logger');

const connectionPool = Mariadb.createPool(Config.get('/dbConnection'));

const connect = function () {
  var conn = null;
  return connectionPool.query().then(function (connection) {
    conn = connection;
    return conn;
  }).catch(function (error) {
    Logger.write.log('error', 'mysql connection', { error: error });
  });
};

module.exports = connect;
