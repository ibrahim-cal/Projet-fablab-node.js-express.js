const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sequelize.js");
const bcrypt = require("bcrypt");


class User extends Model {
    async validPassword(passwordToTest) {
      return bcrypt.compare(passwordToTest, this.passwordHash);
    }
  }
  User.init(
    {
      email: { type: DataTypes.STRING, primaryKey: true },
      passwordHash: DataTypes.STRING,
    },
    { sequelize, modelName: "user" }
  );
  
  module.exports = User;