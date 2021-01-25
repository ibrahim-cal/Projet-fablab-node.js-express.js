const {Utilisateur, sequelize, Role,Permission, RolePermissions, UtilisateurRoles} = require('../models/sequelize');
  
  exports.can1 = async function can1(permission, userId) {
  let roleId = await UtilisateurRoles.findAll({
  where: { utilisateurId: userId },
  });
  
  
  roleId = roleId ? roleId[0].dataValues.roleId : -1;
  
  if (roleId) {
  const permissionNames = await sequelize.query(
  'SELECT p.nom FROM permissions p inner join role_permissions rp on rp.permissionId=p.id where roleId="' +
  roleId +
  '"',
  {
  model: Permission,
  mapToModel: true, // on passe à vrai ici si on a un match
  }
  );
  
  let hasAccess = false;
  // console.log(permissionNames);
  permissionNames.map((nom) => {
  if (permission == nom.dataValues.nom) {
  console.log(nom.dataValues.nom);
  hasAccess = true;
  }
  });
  
  console.log(hasAccess ? "accès OK" : "Pas d'accès");
  return hasAccess;
  } else {
  res.status(401).send("Vous avez pas les permissions");
  return false;
  }
  };
  
  exports.getUserPermissions = async function getUserPermissions1(userId) {
  if (userId != -1) {
  let roleId = await UtilisateurRoles.findAll({
  where: { utilisateurId: userId },
  });
  
  roleId = roleId ? roleId[0].dataValues.roleId : -1;
  
  console.log("roleId",roleId);
  if (roleId) {
  const permissionNames = await sequelize.query(
  'SELECT p.nom FROM permissions p inner join role_permissions rp on rp.permissionId=p.id where roleId="' +
  roleId +
  '"',
  {
  model: Permission,
  mapToModel: true, // on passe à vrai si y a match
  }
  );
  
  let pnames = [];
  
  permissionNames.map((nom) => {
  pnames.push(nom.dataValues.nom);
  });
  console.log(pnames);
  return pnames;
  } else {
  return [];
  }
  } else {
  return [];
  }
  };






