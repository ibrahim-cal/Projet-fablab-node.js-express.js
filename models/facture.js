const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Facture = sequelize.define("facture",
     {
      numeroFacture: {
        type: DataTypes.NUMBER(100),
        allowNull: false,
        },
        dateFacture: {
            type: DataTypes.DATEONLY,
            allowNull: false,
          },
          montant: {
            type: DataTypes.NUMBER(100),
            allowNull: false,
            validate: {
                len: [3, 100],
            },
        },

      url: {
        type: DataTypes.VIRTUAL,
        get() {
          return `/catalog/facture/${this.id}`;
        },
      },
    });
    return Facture;
  };