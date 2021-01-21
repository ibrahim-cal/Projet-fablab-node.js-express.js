const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('role', {
    nom: {
      type: DataTypes.STRING,
      primarykey: true,
    },
  });
  return Role;
};
