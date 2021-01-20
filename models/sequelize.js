const config = require( "../config/mysql.json");
const debug = require("debug")("projet-pid:sequelize");
const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require ("./sequelizeInstance");
const { deserializeUser } = require("passport");


const Facture =             require("./facture")(sequelize);
const LigneFacturation =    require("./ligneFacturation")(sequelize);
const Machine =             require("./machine")(sequelize);
const Utilisateur =         require("./utilisateur")(sequelize);
const Utilisation =         require("./utilisation")(sequelize);
const Role =                require("./role")(sequelize);
const Permission =          require("./permission")(sequelize);

Facture.hasMany(LigneFacturation);
LigneFacturation.belongsTo(Utilisation);
LigneFacturation.belongsTo(Facture);
Utilisateur.hasMany(Facture);
Facture.belongsTo(Utilisateur);

Machine.hasMany(Utilisation);
Utilisation.belongsTo(Machine);

Utilisation.hasMany(LigneFacturation);
Utilisation.belongsTo(Utilisateur);
Utilisateur.hasMany(Utilisation);


//Role.hasMany(Permission);
Permission.belongsToMany(Role, { through: "role_permissions" });
// Utilisateur.hasMany(Role);
Role.belongsToMany(Utilisateur, { through: "utilisateur_roles"});
Utilisateur.belongsToMany(Role, { through: "utilisateur_roles"});

module.exports = { sequelize, Facture, Utilisation, LigneFacturation,
     Machine, Utilisateur, Role, Permission };