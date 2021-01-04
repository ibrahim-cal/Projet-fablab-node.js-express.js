const { Facture, Utilisateur, LigneFacturation, Utilisation } = require("../models/sequelize");
const createError = require("http-errors");
const { body, validationResult } = require("express-validator");
const facture = require("../models/facture");
const passport = require("passport");
var session = require("express-session");

exports.facture_list =  async function (req, res, next) {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
    const facture_list = await Facture.findAll({ // on fait une requete en BDD dans la table facture, en incluant les tables 
      include: [LigneFacturation, Utilisateur], // LigneFacturation et utilisateur. On stocke le tout dans une variable facture_list
    });
    res.render("facture_list", { title: "Liste factures", facture_list });// on renvoie vers la page pug "facture_list"
  } catch (error) {
    next(error);

  }
};

  exports.facture_detail = async function (req, res, next) {
    try {
      const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
      const factureId = req.params.id;
      console.log(req.params.id)
      const factures = await Facture.findByPk(factureId, {// requete dans la BDD sur base de l'id reçu dans l'url, qui correspond
        include: [LigneFacturation, Utilisateur],// à l'id de la ligne de facturation selectionnée juste avant
      });
      console.log(factures)
      if (facture !== null) {
        res.render("facture_detail", { title: "Detail facture", factures });
      } else {
        next(createError(404, "Pas de details de facture"));
      }
    } catch (error) {
      next(error);
    }
  };

exports.facture_create_get =  async function (req, res, next) {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
    const [utilisateurs, factures, ligneFacturations, utilisations] = await Promise.all([
      Utilisateur.findAll(),    // on va récuperer les contenus des tables utilisateur, ligneFact, utilisation
      LigneFacturation.findAll(),
      Utilisation.findAll(),
      
    ]);
    res.render("facture_form", { title: "Nouvelle facture",utilisateurs, factures, ligneFacturations, utilisations });
  } catch (error) {
    next(error);
  }
};
  
  exports.facture_create_post =
  /* [
    
    body("dateFacture", "Date invalide")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
    async function (req, res, next) {
    try {
      const sansFactures = ligneFacturation.filter(ligneF =>
        ligneF.FactureId === null)
      
      const usersId = []

      sansFactures.forEach(element => {
        const userId = element.utilisateurId
        if (!usersId.includes(userId)) {
          usersId.push(userId)
        }
      })

      const users = []
      usersId.forEach(async id => {
        const user = await Utilisateur.findByPk(id)
        user.push(user)
      })
      // A TERMINER ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

*/
  exports.facture_delete_get = async function (req, res, next) {
    try {
      const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
      const facture = await Facture.findByPk(req.params.id, {
        include: [LigneFacturation],
      });
      if (facture === null) {
        res.redirect("/catalog/facture");
      } else {
        res.render("facture_delete", { title: "Suppression facture", facture });
      }
    } catch (error) {
      next(error);
    }
  };
  
  exports.facture_delete_post =  async function (req, res, next) {
    try {
      const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
      const facture = await Facture.findByPk(req.params.id, {
        include: [LigneFacturation],
      });
      if (facture === null) {
        next(createError(404, "pas de facture"));
      } 
       else {
        await facture.destroy();
        res.redirect("/catalog/factures");
      }
      
    } catch (error) {
      next(error);
    }
  };