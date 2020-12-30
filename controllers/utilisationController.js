const { Utilisation, Utilisateur, Machine } = require("../models/sequelize");
const createError = require("http-errors");
const { body, validationResult } = require("express-validator");

exports.utilisation_list = async function (req, res, next) {
  try {
    const utilisation_list = await Utilisation.findAll({
      include: [Machine, Utilisateur],
    });
    res.render("utilisation_list", { title: "Liste des utilisations", utilisation_list });
  } catch (error) {
    next(error);
  }
};

  exports.utilisation_detail = async function (req, res, next) {
    try {
      const utilisationId = req.params.id;
      const utilisation = await Utilisation.findByPk(utilisationId, {
        include: [Utilisateur, Machine],  });
      if (utilisation !== null) {
        res.render("utilisation_detail", { title: "Details des utilisations", utilisation});
      } else {
        next(createError(404, "utilisation pas trouvee"));
      }
    } catch (error) {
      next(error);
    }
  };

exports.utilisation_create_get = function (req, res) {
  res.render("utilisation_form", { title: "Nouvelle utilisation" });
}; 
  
  exports.utilisation_create_post = [
    body("duree")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("la duree doit être specifee"),
    body("dateUtilisation", "Date invalide")
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate(),
      async function (req, res, next) {
        try {
          const errors = validationResult(req);
    
          if (!errors.isEmpty()) { // si y a une erreur lors du remplissage formulaire
            res.render("utilisation_form", {// on redirige vers le formulaire
              title: "nouvelle utilisation",
              utilisation: req.body,
              errors: errors.array(),
            });
          } else {

            const utilisation = await Utilisation.build({
              duree: req.body.duree,
            });
            if (req.body.dateUtilisation) {
              utilisation.dateUtilisation = req.body.dateUtilisation;
            }
 
            await utilisation.save();
            res.redirect("/catalog/machines");
          }
        } catch (error) {
          next(error);
        }
      },
    ];



  exports.utilisation_delete_get = async function (req, res, next) {
    try {
      const utilisation = await Utilisation.findByPk(req.params.id, {
        include: [Machine, Utilisateur],
      });
      if (utilisation === null) {
        res.redirect("/catalog/utilisations");
      } else {
        res.render("utilisation_delete", { title: "Supprimer utilisation", utilisation });
      }
    } catch (error) {
      next(error);
    }
  };
  
  exports.utilisation_delete_post =  async function (req, res, next) {
    try {
      const utilisation = await Utilisation.findByPk(req.params.id, {
        include: [Machine, Utilisateur],
      });
      if (utilisation === null) {
        next(createError(404, "utilisation not found"));
      } else if (utilisation.factures.length > 0) {
        res.render("facture_detail", { title: "Detail facture"});
      } else {
        await utilisation.destroy();
        res.redirect("/catalog/utilisations");
      }
      
    } catch (error) {
      next(error);
    }
  };