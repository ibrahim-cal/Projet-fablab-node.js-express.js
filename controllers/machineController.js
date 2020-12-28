const { Machine, Utilisation } = require("../models/sequelize");
const createError = require("http-errors");
const { body, validationResult } = require("express-validator");
const machine = require("../models/machine");


exports.index = async function (req, res, next) {
 
    res.render("index", {
      title: "Accueil FabLab "
    });
  };

  exports.machine_list = async function (req, res, next) {
    try {
      const machine_list = await Machine.findAll({
        order: [["nom", "ASC"]],
      });
      res.render("machine_list", { title: "Voici la liste des machines disponibles :", machine_list });
    } catch (error) {
      next(error);
    }
  };

exports.machine_create_get = function (req, res, next) {
    res.render("machine_form", { title: "Encoder une nouvelle machine"});
  };
  
  exports.machine_create_post =  [
    body("nom")   
    .trim()       // méthodes de
    .notEmpty()  //  nettoyage 
    .escape()   //   & validation  
    .withMessage("Veuillez spécifier le nom de la machine") ,
    body("tarif")
    .trim()
    .notEmpty()
    .escape()
    .withMessage("Veuillez indiquer un tarif à la minute"),
    async function (req, res, next) {
      try {
      const errors = validationResult(req);                          // récupération erreurs validation

      if(!errors.isEmpty()) {
        res.render("machine_form", {
          title : "Encoder une nouvelle machine :",
          machine : req.body,       // garder les champs valides 
          errors: errors.array(),   // tableau d'erreurs des champs invalides
        });
      } else {
         
          const machine = await Machine.build({ // on créer l'objet
           nom : req.body.nom,
           tarif : req.body.tarif,
          });
        
          await machine.save();                 // on le sauve en BDD
          res.redirect(machine.url);            // redirection après sauvegarde
          }
        } catch (error){
          next(error);
        }
      },
  ];



exports.machine_update_get = async function (req, res, next) {
  try{
    const machine= await Promise.all([
      Machine.findByPk(req.params.id, {
      }),
    ]);
  if (machine === null) {
    next(createError(404, "Machine non trouvée "));
  } else {
    res.render("machine_form",{
      title : "Modification machine",
      machine,
    });
  }
}  catch (error){
  next(error);
}
  };
  
  exports.machine_update_post = [
    (req, res, next) => {
     next();
  },
    body("nom", "Veuillez indiquer le nom de la machine.").trim().notEmpty().escape(),
    body("tarif", "Veuillez indiquer un tarif.").trim().notEmpty().escape(),
    async (req, res, next) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        res.render("machine_form", {
          title : "Modification machine ",
          machine : req.body,
          errors : errors.array(),
        });
      }else {
        const machine = await Machine.findByPk(req.params.id);
        machine.nom = req.body.nom;
        machine.tarif = req.body.tarif;
        await machine.save();
      }
        res.redirect(machine.url);
    
    } catch (error){
      next(error);
    }
  },
  ];

  exports.machine_delete_get = async function (req, res, next) {
    try{
      const machine = await Machine.findByPk(req.params.id,{ // on récupère machine à partir de l'id et..
        include: Utilisation,                               //  les utilisations qui y sont liées 
      });
      if (machine === null){
        res.redirect("/catalog/machines"); 
      } else{
        res.render("machine_delete", {title : "Suppression de la machine ", machine});
      } // Si on a trouvé la machine en BDD, on redirige vers template avec infos citées
   
    } catch(error){
      next(error);
    }
  };
  
  exports.machine_delete_post = async function (req, res, next) {
   try {
     const machine = await Machine.findByPk(req.params.id,{
        include: Utilisation,
     });
     if (machine === null) {                            // si on trouve pas la machine
       next(createError(404, "Machine non trouvée"));  // on renvoie erreur 404
     } else if (machine.utilisations.length > 0) {             // si il reste une utilisation
       res.render("machine_delete",                         // on revient au formulaire
        { title: " Suppression de la machine ", machine});  
     } else {
       await machine.destroy();                       // si 0 utilisation -> suppression machine
       res.redirect("/catalog/machines");
     }
     }catch (error){
       next(error);
   }
  };

  exports.machine_detail = function (req, res) {
    res.send("NOT IMPLEMENTED: machine detail");
  };