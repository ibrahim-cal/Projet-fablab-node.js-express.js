const { Sequelize } = require("sequelize");
const config = require( "../config/mysql.json");
const debug = require("debug")("projet-pid:sequelize");

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      logging: (msg) => debug(msg),
      dialect: "mysql",
      host: config.host,
      port: config.port,
    }
  );
  module.exports = sequelize;