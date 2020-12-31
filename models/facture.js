const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Facture = sequelize.define("facture",
    {
      numeroFacture: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
     
      montant: {
        type: DataTypes.DECIMAL(65),
        allowNull: false,
      },
      dateFacture: DataTypes.DATEONLY,
      
        name: {
          type: DataTypes.VIRTUAL,
          get() {
            if (this.numeroFacture && this.montant) {
              return `${this.montant}, ${this.numeroFacture}`;
            } else {
              return "";
            }
          },
        },
        url: {
          type: DataTypes.VIRTUAL,
          get() {
            return `/catalog/facture/${this.id}`;
          },
        },
        lifespan: {
          type: DataTypes.VIRTUAL,
          get() {
            let lifetime_string = "";
            if (this.dateFacture) {
              lifetime_string = DateTime.fromISO(this.dateFacture).toFormat("MMMM Do, YYYY");
            }
            return lifetime_string;
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