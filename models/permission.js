const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Permission = sequelize.define("permission", {
        nom: {
            type: DataTypes.STRING,
            primarykey: true,
        },
        url: {
            type: DataTypes.VIRTUAL,
            get() {
              return `/catalog/permission/${this.id}`;
            },
          },
    });
return Permission;
};

