const { Facture, LigneFacturation, Utilisation, Utilisateur } = require("../models/sequelize");
const createError = require("http-errors");

exports.facture_list =  async function (req, res, next) {
  try {
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
    const [ligneFacturations, utilisations] = await Promise.all([
      LigneFacturation.findAll(),
      Utilisations.findAll(),
    ]);
    res.render("facture_form", { title: "Nouvelle facture", ligneFacturations, utilisations });
  } catch (error) {
    next(error);
  }
};
  
  exports.facture_create_post = function (req, res) {
    // Recup la période (du form)
    const period = req.body.periode

    // recup toutes les ligne de fact de la periode
    const ligenFacturations = await LigneFacturation.findAll({
      where: {
      // date == bonne date
      },
      include: utilisations
    })

    // filtre pour garder celle non facturée
    const SansFactures = ligenFacturations.filter(ligneFact => ligneFact.FactureId === null)

    //////////////////////////////////////////// OPTIONNEL
    // Recup les utilisations
    const utilisations = []
    SansFactures.forEach(async el => {
      const utilisation = await Utilisation.findByPk(el.utilisationId)
      utilisations.push(utilisation)
    })
    //////////////////////////////////////////// OPTIONNEL

    // Recup les users
    const usersids = []

    // eviter les doublons des userID
    SansFactures.forEach(el => {
      const userId = el.utilisateurId
      if (!usersids.includes(userId)) {
        usersids.push(userId)
      }
    })

    const users = []

    usersids.forEach(async id => {
      const user = await Utilisateur.findByPk(id)
      users.push(user)
    })


    // ligne de fact à factuer dans `SansFactures`
    // les info des users dans `users`



    res.send("NOT IMPLEMENTED: facture create POST");
  };

  exports.facture_delete_get = async function (req, res, next) {
    try {
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
