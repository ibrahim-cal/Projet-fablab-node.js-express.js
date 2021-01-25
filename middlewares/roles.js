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






/*



exports.can1 =  async function can1(permission, userId) {
 

  
  let roleId = await UtilisateurRoles.findAll({where:{utilisateurId:userId}});

   roleId = roleId?roleId[0].dataValues.utilisateurId:undefined;

   if(roleId){

    const permissionNames = await sequelize.query('SELECT p.nom FROM permissions p inner join role_permissions rp on rp.permissionId=p.id where roleId="'+roleId+'"', {
      model: Permission,
      mapToModel: true // on passe à vrai ici si on a un match
    })

    let hasAccess=false;
// console.log(permissionNames);
    permissionNames.map(nom=>{
      if(permission==nom.dataValues.nom){
        console.log(nom.dataValues.nom);
           hasAccess=true;
      }
    })

    console.log(hasAccess?"accès OK":"Pas d'accès");
    return hasAccess

   }else{
    res.status(401).send('Vous avez pas les permissions');
     return false;
   }
}

exports.getUserPermissions =async function getUserPermissions1(userId) {

  console.log(userId);
  if(userId!=-1){
    
  let roleId = await UtilisateurRoles.findAll({where:{utilisateurId:userId}});

  roleId = roleId?roleId[0].dataValues.utilisateurId:-1;

  console.log(roleId);
  if(roleId){

   const permissionNames = await sequelize.query('SELECT p.nom FROM permissions p inner join role_permissions rp on rp.permissionId=p.id where roleId="'+roleId+'"', {
     model: Permission,
     mapToModel: true // on passe à vrai si y a match
   })

  //  let hasAccess=false;

   let pnames=[];
// console.log(permissionNames);
   permissionNames.map(nom=>{
    pnames.push(nom.dataValues.nom)
   })
  //  console.log(hasAccess?"accès ok":"pas d'accès");
   return pnames
  }else{
    return [];
  }
  }else{
    return [];
  }


}





/*exports.checkP =async function getUserPermissions(user) {
  const userRoles = user.roles;

  const all = await Promise.all(
  userRoles.map((role) =>
   RolePermissions.findAll({
        where: { roleId: role.id },
      })
    )
  );
  return all;
}

/*
/*
/*
  async function can(user, permission, role) {
    const userRoles = user.roles;
    let concernedRole = null;
    let hasRole = userRoles.some((r, index, roles) => {
      const hr = r.nom === role;
      if (hr) {
        concernedRole = roles[index];
      }
      return hr;
    });
  
    if (!hasRole) {
      return false;
    }
  
    const role_permissions = await RolePermissions.findAll();
    const permissionsIds = role_permissions.filter((role_perm) => {
      return role_perm.roleId === concernedRole.id;
    });
  
    const permissions = await Permission.findAll();
    const concernedPermission = permissions.find((p) => p.nom === permission);
    const hasAccess = permissionsIds.some(
      (p) => p.permissionId === concernedPermission.id
    );
    return hasAccess;
  }
  */
 /*
  exports.checkPermission = function (permission, role) {
    return async (req, res, next) => {
      try {
        const user = await Utilisateur.findByPk(req.user.id, {
        include: [{
              model: Role,
              as: 'roles',
        },],
        });
        const hasAccess = await can(user, permission, role);
  
        if (hasAccess) {
          req.userPermissions = await getUserPermissions(user);
          console.log('++++++', req.userPermissions);
          next();
        } else {
          res.status(401).send('Vous avez pas les permissions');
        }
      } catch (error) {
        // next(error)
        console.log('ERR', error.message);
        res.status(401).send('Vous avez pas les permissions');
      }
    };
  };
  
/*
  exports.can1 = async function can1(permission, userId)
{}
*/
