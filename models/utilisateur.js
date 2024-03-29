const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
  const Utilisateur = sequelize.define("utilisateur", {
    prenom: {
      type: DataTypes.STRING(100),
      validate: {
        len: [2, 100],
      },
      allowNull: false,
    },

    nom: {
      type: DataTypes.STRING(100),
      validate: {
        len: [2, 100],
      },
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    passwordHash: DataTypes.STRING(100),

   

    name: {
      type: DataTypes.VIRTUAL,
      get() {
        if (this.prenom && this.nom && this.email && this.passwordHash) {
          return `${this.prenom}, ${this.nom}, ${this.email}, ${this.passwordHash}`;
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
  },
  );
  return Utilisateur;
};