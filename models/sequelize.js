const config = require('../config/mysql.json');
const debug = require('debug')('projet-pid:sequelize');
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./sequelizeInstance');
const { deserializeUser } = require('passport');

const Facture = require('./facture')(sequelize);
// const LigneFacturation =    require("./ligneFacturation")(sequelize);
const Machine = require('./machine')(sequelize);
const Utilisateur = require('./utilisateur')(sequelize);
const Utilisation = require('./utilisation')(sequelize);
const Role = require('./role')(sequelize);
const Permission = require('./permission')(sequelize);

//Facture.hasMany(LigneFacturation);
//LigneFacturation.belongsTo(Utilisation);
//LigneFacturation.belongsTo(Facture);
Utilisation.belongsTo(Facture);
Facture.hasMany(Utilisation);

Utilisateur.hasMany(Facture);
Facture.belongsTo(Utilisateur);

Machine.hasMany(Utilisation);
Utilisation.belongsTo(Machine);

//Utilisation.hasMany(LigneFacturation);
Utilisation.belongsTo(Utilisateur);
Utilisateur.hasMany(Utilisation);

Permission.belongsToMany(Role, { through: 'role_permissions' });
Role.belongsToMany(Permission, { through: 'role_permissions' });
Role.belongsToMany(Utilisateur, { through: 'utilisateur_roles' });
Utilisateur.belongsToMany(Role, { through: 'utilisateur_roles' });

const RolePermissions = sequelize.model('role_permissions');
const UtilisateurRoles = sequelize.model('utilisateur_roles');

module.exports = {
  sequelize,
  Facture,
  Utilisation,
  Machine,
  Utilisateur,
  Role,
  Permission,
  RolePermissions,
  UtilisateurRoles,
};
