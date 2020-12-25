const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Utilisation = sequelize.define("utilisation", {
    dateUtilisation: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    duree: {
      type: DataTypes.NUMBER(50),
      allowNull: false,
    },
    url: {
      type: DataTypes.VIRTUAL,
      get() {
        return `/catalog/utilisation/${this.id}`;
      },
    },
  });
  return Utilisation;

};
