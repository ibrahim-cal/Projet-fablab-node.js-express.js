const config = require( "../config/mysql.json");
const debug = require("debug")("projet-pid:db");
const { Sequelize, DataTypes, Model } = require("sequelize");

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

// A COMPLETER AVEC LES AUTRES TABLES
const User = require("./User")(sequelize);
const Equipement = require("./equipement")(sequelize);

User.hasMany(Equipement);
Equipement.hasMany(User);

module.exports = { sequelize, User, Equipement};