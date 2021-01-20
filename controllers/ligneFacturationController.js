const { LigneFacturation, Facture, Utilisation } = require("../models/sequelize");
const createError = require("http-errors");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
var session = require("express-session");


  exports.ligneFacturation_detail = async function (req, res, next) {
    try {
      const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
      const ligneFacturationId = req.params.id;
      const ligneFacturation = await LigneFacturation.findByPk(ligneFacturationId, {
        include: [Facture, Utilisation],
      });
      if (ligneFacturation !== null) {
        res.render("ligneFacturation_detail", { title: "Detail ligne facturation", ligneFacturation });
      } else {
        next(createError(404, "Pas de ligne de facturation"));
      }
    } catch (error) {
      next(error);
    }
  };

  exports.ligneFacturation_delete_get = async function (req, res, next) {
    try {
      const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
      const ligneFacturation = await LigneFacturation.findByPk(req.params.id, {
        include: [Facture, Utilisation],
      });
      if (ligneFacturation === null) {
        res.redirect("/catalog/utilisations");
      } else {
        res.render("ligneFacturation_delete", { title: "Supprimer ligne de facturation", ligneFacturation });
      }
    } catch (error) {
      next(error);
    }
  };
  
  exports.ligneFacturation_delete_post = async function (req, res, next) {
    try {
      const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
      const ligneFacturation = await LigneFacturation.findByPk(req.params.id, { // recherche de la ligne de facturation en BDD
        include: [Facture, Utilisation],// sur base de l'id reçu dans l'url
      });
      if (ligneFacturation === null) {
        next(createError(404, "Pas de ligne de facturation"));
      } 
       else {
        await ligneFacturation.destroy();
        res.redirect("/catalog/utilisations");
      }
      
    } catch (error) {
      next(error);
    }
  };

  exports.ligneFacturation_create_get = function (req, res) {
    res.send("NOT IMPLEMENTED: ligneFacturation create GET");
  };
  
  exports.ligneFacturation_create_post = function (req, res) {
    res.send("NOT IMPLEMENTED: ligneFacturation create POST");
  };

  exports.ligneFacturation_list = function (req, res) {
    res.send("NOT IMPLEMENTED: ligneFacturation list");
  };
