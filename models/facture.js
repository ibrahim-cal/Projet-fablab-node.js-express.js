const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Facture = sequelize.define("facture",
    {
      numeroFacture: {
        type: DataTypes.INTEGER(100),
        allowNull: false,
      },
     
      montant: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },
      dateFacture: DataTypes.DATEONLY,
      /*
        name: {
          type: DataTypes.VIRTUAL,
          get() {
            if (this.numeroFacture && this.montant) {
              return `${this.montant}, ${this.numeroFacture}`;
            } else {
              return "";
            }
          },
        },*/
        url: {
          type: DataTypes.VIRTUAL,
          get() {
            return `/catalog/facture/${this.id}`;
          },
        },
        
        dateFacture_yyyy_mm_dd: {
          type: DataTypes.VIRTUAL,
          get() {
            return DateTime.fromISO(this.dateFacture).toFormat("YYYY-MM-DD");
          },
        }
      });
  return Facture;
};