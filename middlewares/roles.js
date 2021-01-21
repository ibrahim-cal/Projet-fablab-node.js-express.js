const {
  Utilisateur,
  Role,
  Permission,
  RolePermissions,
} = require('../models/sequelize');

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

exports.roleMiddleware = async function (requiredRoles, req, res, next) {
  /**
   * Le middleware recoit en paramètre la liste des roles que l'utilisateur
   * devrait avoir (un au moins) et vérifie si l'utilisateur connectée
   * a un de ceux là
   */

  if (req.user) {
    const user = await Utilisateur.findByPk(req.user.id, {
      include: [
        {
          model: Role,
          as: 'roles',
        },
      ],
    });
    const roles = user.roles.map((role) => role.nom);
    let canPass = false;
    for (let i = 0; i < requiredRoles.length; i++) {
      const role = requiredRoles[i];
      if (roles.includes(role)) {
        canPass = true;
        break;
      }
    }

    if (canPass) {
      next();
      return;
    }
  }
  res.status(401).send('Vous avez pas les permissions');
};

exports.permissionMiddleware = async function (
  requiredPermissions,
  req,
  res,
  next
) {
  /**
   * Le middleware recoit en paramètre la liste des permissions que l'utilisateur
   * devrait avoir (un au moins) et vérifie si l'utilisateur connecté
   * a un de ceux là.
   *  si c'est le cas, on execute la fonction next
   * dans le cas contraire on envoie un message de 401: pas de permissions
   */
  if (req.user) {
    const user = await Utilisateur.findByPk(req.user.id, {
      include: [
        {
          model: Permission,
          as: 'permissions',
        },
      ],
    });
    const permissions = user.permissions.map((permission) => permission.nom);
    let canPass = false;
    for (let i = 0; i < requiredPermissions.length; i++) {
      const permission = requiredPermissions[i];
      if (permissions.includes(permission)) {
        canPass = true;
        break;
      }
    }
    if (canPass) {
      next();
      return;
    }
  }
  res.status(401).send('Vous avez pas les permissions');
};
