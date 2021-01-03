const { Facture, LigneFacturation, Utilisation } = require("../models/sequelize");
const createError = require("http-errors");
const facture = require("../models/facture");

exports.facture_list =  async function (req, res, next) {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
    const facture_list = await Facture.findAll({
      include: [LigneFacturation],
    });
    res.render("facture_list", { title: "Liste factures", facture_list });
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
      const facture = await Facture.findByPk(factureId, {
        include: [LigneFacturation],
      });
      if (facture !== null) {
        res.render("facture_detail", { title: "Detail facture", facture });
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
    const [factures, ligneFacturations, utilisations] = await Promise.all([
      LigneFacturation.findAll(),
      Utilisation.findAll(),
      
    ]);
    res.render("facture_form", { title: "Nouvelle facture", factures, ligneFacturations, utilisations });
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