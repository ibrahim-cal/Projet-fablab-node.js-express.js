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
                type: DataTypes.NUMBER(100),
                allowNull: false,
                validate: {
                    len: [3, 100],
                },
            },
            url: {
                type: DataTypes.VIRTUAL,
                get() {
                    return `/catalog/machine/${this.id}`;
                },

            },
        });
    return Machine;
};