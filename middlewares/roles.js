const {Utilisateur, Role,Permission, RolePermissions,} = require('../models/sequelize');
  
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
  
  exports.checkPermission = function (permission, role) {
    return async (req, res, next) => {
      try {
        const user = await Utilisateur.findByPk(req.user.id, {
        include: [
         {
              model: Role,
              as: 'roles',
        },
              ],
        });
        const hasAccess = await can(user, permission, role);
  
        if (hasAccess) {
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