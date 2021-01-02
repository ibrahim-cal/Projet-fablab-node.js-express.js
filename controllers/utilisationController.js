const { Utilisation, Utilisateur, Machine, LigneFacturation } = require("../models/sequelize");
const createError = require("http-errors");
const { body, validationResult } = require("express-validator");
const machine = require("../models/machine");
const utilisateur = require("../models/utilisateur");

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
        next(createError(404, "Pas d'utilisations"));
      }
    } catch (error) {
      next(error);
    }
  };

exports.utilisation_create_get = async function (req, res, next) {
  try {
    
    if
    (req.query.machineid)
    {
      machine.id = machine.id
    }
    else if(req.query.utilisateurid)
      {
       {utilisateurid=utilisateur.id}
      }
    const [utilisations, machines, utilisateurs] = await Promise.all([
      Machine.findAll(),
      Utilisateur.findAll(),
    ]);
    res.render("utilisation_form", { title: "Nouvelle utilisation", utilisations, machines, utilisateurs });
  } catch (error) {
    next(error);
  }
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
    
          if (!errors.isEmpty()) {
            // si y a une erreur lors du remplissage formulaire

            
              const [machines, utilisateurs] = await Promise.all([
                Machine.findAll(),
                Utilisateur.findAll(),
              ]);
            res.render("utilisation_form", {// on redirige vers le formulaire
              title: "nouvelle utilisation",
              utilisation: req.body,
              machines,
              utilisateurs,
              errors: errors.array(),
            });
          } else {

            const utilisation = await Utilisation.build({// sinon on va créer la nouvelle utilisation
              duree: req.body.duree, // on récupere la durée introduite dans le form
            });
            if (req.body.dateUtilisation) {
              utilisation.dateUtilisation = req.body.dateUtilisation;// idem avec date
            }
             // await utilisation.setMachine(machine);
             // await utilisation.setUtilisateur(utilisateur);
 
            await utilisation.save(); // on sauvegarde le tout en tant que nouvelle utilisation en bdd
            res.redirect("/catalog/machines");// ensuite on redirige vers catalogue machines
          }
        } catch (error) {
          next(error);
        }
      },
    ];



  exports.utilisation_delete_get = async function (req, res, next) {
    try {
      const utilisation = await Utilisation.findByPk(req.params.id, {
        include: [Machine, Utilisateur, LigneFacturation],
      });
      if (utilisation === null) {
        res.redirect("/catalog/utilisateurs");
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
        include: [Machine, Utilisateur, LigneFacturation],
      });
      if (utilisation === null) {
        next(createError(404, "pas d'utilisation"));
      } 
       else {
        await utilisation.destroy();
        res.redirect("/catalog/utilisations");
      }
      
    } catch (error) {
      next(error);
    }
  };