const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Equipement = sequelize.define("equipement",
        {
            nom: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: {
                    len: [3, 100],
                },
            },
            prix: {
                type: DataTypes.DECIMAL(100),
                allowNull: false,
                unique: true,
                validate: {
                    len: [3, 100],
                },
            },
            url: {
                type: DataTypes.VIRTUAL,
                get() {
                    return `/catalog/equipement/${this.id}`;
                },

            },
        });
    return Equipement;
};