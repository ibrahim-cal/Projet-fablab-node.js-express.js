const { Utilisation, Utilisateur } = require("../models/sequelize");
const createError = require("http-errors");

exports.utilisation_list = function (req, res) {
    res.send("NOT IMPLEMENTED: utilisation list");
  };

  exports.utilisation_detail = async function (req, res, next) {
    try {
      const utilisationId = req.params.id;
      const utilisation = await Utilisation.findByPk(utilisationId, {
        include: Utilisateur });
      if (utilisation !== null) {
        res.render("utilisation_detail", { title: "Details des utilisations", utilisation });
      } else {
        next(createError(404, "Aucune utilisation"));
      }
    } catch (error) {
      next(error);
    }
  };

exports.utilisation_create_get =  async function (req, res, next) {
  try {
    const utilisateurs = await Promise.all([
      Utilisateur.findAll(),
    ]);
    res.render("utilisation_form", { title: "Encoder utilisation", utilisateurs });
  } catch (error) {
    next(error);
  }
};
  
  exports.utilisation_create_post = function (req, res) {
    res.send("NOT IMPLEMENTED: utilisation create POST");
  };

  exports.utilisation_delete_get = function (req, res) {
    res.send("NOT IMPLEMENTED: utilisation delete GET");
  };
  
  exports.utilisation_delete_post = function (req, res) {
    res.send("NOT IMPLEMENTED: utilisation delete POST");
  };