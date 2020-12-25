const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sequelize.js");
const bcrypt = require("bcrypt");


const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Utilisateur = sequelize.define("utilisateur", {
    prenom: {
      type: DataTypes.STRING(100),
      validate: {
        len: [3, 100],
        allowNull: false,
      }
    },

    nom: {
      type: DataTypes.STRING(100),
      validate: {
        len: [3, 100],
        allowNull: false,
      }
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    motDePasse: DataTypes.STRING(100),

    url: {
      type: DataTypes.VIRTUAL,
      get() {
        return `/catalog/utilisateur/${this.id}`;
      },
    },
  });
  return Utilisateur;
};