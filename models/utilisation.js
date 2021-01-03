const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Utilisation = sequelize.define("utilisation", {
    duree: {
      type: DataTypes.INTEGER(50),
      allowNull: false,
    },
   
    dateUtilisation: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  
    name: {
      type: DataTypes.VIRTUAL,
      get() {
        if (this.duree) {
          return `${this.duree}`;
        } else {
          return "";
        }
      },
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
