const config = require( "../config/mysql.json");
const debug = require("debug")("projet-pid:sequelize");
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

const Facture =             require("./facture")(sequelize);
const LigneFacturation =    require("./ligneFacturation")(sequelize);
const Machine =             require("./machine")(sequelize);
const Utilisateur =         require("./utilisateur")(sequelize);
const Utilisation =         require("./utilisation")(sequelize);

Facture.hasMany(LigneFacturation);
LigneFacturation.belongsTo(Utilisation);
LigneFacturation.belongsTo(Facture);

Machine.hasMany(Utilisation);
Utilisation.belongsTo(Machine);
Utilisation.hasMany(LigneFacturation);
Utilisation.belongsTo(Utilisateur);
Utilisateur.hasMany(Utilisation);



module.exports = { sequelize, Facture, Utilisation, LigneFacturation,
     Machine, Utilisateur };