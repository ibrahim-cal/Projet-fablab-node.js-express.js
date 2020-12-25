const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const LigneFacturation = sequelize.define("ligneFacturation",
        {
            nomMachine: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    len: [3, 100],
                },
            },
            prix: {
                type: DataTypes.NUMBER(100),
                allowNull: false,
                validate: {
                    len: [3, 100],
                },
            },
            duree: {
                type: DataTypes.NUMBER(50),
                allowNull: false,
            },
            sousTotal: {
                type: DataTypes.NUMBER(100),
                allowNull: false,
                validate: {
                    len: [3, 100],
                },

            },
            url: {
                type: DataTypes.VIRTUAL,
                get() {
                    return `/catalog/ligneFacturation/${this.id}`;
                },
            },
        });
    return LigneFacturation;
};