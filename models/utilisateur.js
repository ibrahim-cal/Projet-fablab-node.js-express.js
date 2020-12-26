

const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize.js");
const bcrypt = require("bcrypt");


module.exports = (sequelize) => {
  const Utilisateur = sequelize.define("utilisateur", {
    prenom: {
      type: DataTypes.STRING(100),
      validate: {
        len: [2, 100],},
        allowNull: false,
      
    },

    nom: {
      type: DataTypes.STRING(100),
      validate: {
        len: [2, 100],},
        allowNull: false,
      
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    motDePasse: DataTypes.STRING(100),

    name: {
      type: DataTypes.VIRTUAL,
      get() {
        if (this.prenom && this.nom && this.email && this.motDePasse) {
          return `${this.prenom}, ${this.nom}, ${this.email}, ${this.motDePasse}`;
        } else {
          return "";
        }
      },
    },
    url: {
      type: DataTypes.VIRTUAL,
      get() {
        return `/catalog/utilisateur/${this.id}`;
      },
    },
  });
  return Utilisateur;
};