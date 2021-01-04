const { Utilisation, Utilisateur, Machine, LigneFacturation } = require("../models/sequelize");
const createError = require("http-errors");
const { body, validationResult } = require("express-validator");
const machine = require("../models/machine");
const passport = require("passport");
var session = require("express-session");

exports.utilisation_list = async function (req, res, next) {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
    const utilisation_list = await Utilisation.findAll({ // on récupere la liste des utilisations et on la stocke
      include: [Machine, Utilisateur],                  // dans utilisation_list, pour ensuite la reutiliser dans la vue
    });
    res.render("utilisation_list", { title: "Liste des utilisations", utilisation_list });
  } catch (error) {
    next(error);
  }
};

  exports.utilisation_detail = async function (req, res, next) {
    try {
      const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
      const utilisationId = req.params.id; // on recupere l'id de l'url (celui de l'utilisateur selectionné)
      const utilisation = await Utilisation.findByPk(utilisationId, {// et on lance une recherche en BDD 
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
    const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
    let machine;
    let utilisateur;
    if (req.query.machineid) { // 49 - 54 : si on a reçu dans l'url un id de machine ou utilisateur, on va le stocker
      machine = await Machine.findByPk(req.query.machineid); // dans une variable. Ensuite on fait une recherche en BDD
    } else if (req.query.utilisateurid) {                   // correspondante sur base de l'id
      utilisateur = await Utilisateur.findByPk(req.query.utilisateurid);
    }
    const [machines, utilisateurs] = await Promise.all([
      Machine.findAll(),
      Utilisateur.findAll(),
    ]);
    if (req.query.machineid) {
    res.render("utilisationM_form", { title: "Nouvelle utilisation", machine, utilisateur, machines, utilisateurs });}
    if (req.query.utilisateurid) {
    res.render("utilisationU_form", { title: "Nouvelle utilisation", machine, utilisateur, machines, utilisateurs });}
    else{
      // on a deux if, qui vont renvoyer vers un formulaire légerement différent. Selon qu'on ait reçu l'id d'une machine
      // ou d'un utilisateur dans l'url. Càd si de la page précedente etait une machine ou un user selectionné

    
    res.render("utilisation_form", { title: "Nouvelle utilisation", machine, utilisateur, machines, utilisateurs });}
  } catch (error) {
    next(error);
  }
};

  exports.utilisation_create_post = [
    body("duree") //ligne 73 -81 : on fait la validation & nettoyage des champs
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
          const user = req.user;
      if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
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
              duree: req.body.duree, 
              // on récupere la durée introduite dans le form
            });
            if (req.body.dateUtilisation) {
              utilisation.dateUtilisation = req.body.dateUtilisation;// idem avec date
            }
            const recupUtilisateur = await Utilisateur.findByPk(req.body.utilisateuridhidden || req.body.utilisateurid);
           
              await utilisation.setUtilisateur(recupUtilisateur);
            
              const recupMachine = await Machine.findByPk(req.body.machineidhidden || req.body.machineid);
   
              await utilisation.setMachine(recupMachine);
 
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
      const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
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
      const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
      const utilisation = await Utilisation.findByPk(req.params.id, {
        include: [Machine, Utilisateur, LigneFacturation], // on cherche en BDD, l'utilisation ayant
                                      // l'id correspondant à celui dans l'url (donc l'utilisation sélectionnée)
      });
      if (utilisation === null) {
        next(createError(404, "pas d'utilisation"));
      } 
       else {
        await utilisation.destroy(); // on supprime l'utilisation qui correspondait
        res.redirect("/catalog/utilisations");
      }
      
    } catch (error) {
      next(error);
    }
  };