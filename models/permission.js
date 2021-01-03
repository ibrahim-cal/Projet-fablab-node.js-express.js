const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Permission = sequelize.define("permission", {
        nom: {
            type: DataTypes.STRING,
            primarykey: true,
        },
    });
return Permission;
};

