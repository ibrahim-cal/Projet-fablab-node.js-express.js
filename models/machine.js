const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Machine = sequelize.define("machine",
        {
            nom: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    len: [3, 100],
                },
            },
            tarif: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    len: [2, 100],
                },
            },
            url: {
                type: DataTypes.VIRTUAL,
                get() {
                    return `/catalog/machine/${this.id}`;
                },
            },
                name: {
                    type: DataTypes.VIRTUAL,
                    get() {
                      if (this.nom && this.tarif) {
                        return `${this.nom}, ${this.tarif}`;
                      } else {
                        return "";
                      }
                    }
            },
        });
    return Machine;
};