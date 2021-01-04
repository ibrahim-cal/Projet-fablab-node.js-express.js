const { Machine, Utilisation } = require("../models/sequelize");
const createError = require("http-errors");
const { body, validationResult } = require("express-validator");
const machine = require("../models/machine");
const passport = require("passport");
var session = require("express-session");

exports.index = async function (req, res, next) {
  const newlyAuthenticated = req.session.newlyAuthenticated;
  delete req.session.newlyAuthenticated;
    res.render("index", {
      title: "Accueil fabLab ",
      user: req.user,
      currentUrl: req.originalUrl,
      newlyAuthenticated,
    });
  };

  exports.machine_list = async function (req, res, next) {
    
    try {
      const user = req.user;
      if (!user) {
        return res.redirect("/catalog/utilisateur/login");
      }
      const machine_list = await Machine.findAll({  // on récupere la liste des machines en la stockant dans variable
        order: [["nom", "ASC"]],  // machine_list
      });
      res.render("machine_list", { title: "Voici la liste des machines disponibles :", machine_list });
    } catch (error) {
      next(error);
    }
  };

exports.machine_create_get = function (req, res, next) {
  const user = req.user;
    if (!user) {
      return res.redirect("/login");
    }
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
      const user = req.user;
    if (!user) {
      return res.redirect("/login");
    }
      try {
      const errors = validationResult(req);   // récupération erreurs validation

      if(!errors.isEmpty()) {
        res.render("machine_form", {
          title : "Encoder une nouvelle machine :",
          machine : req.body,       //permet de garde les champs valides 
          errors: errors.array(),   // tableau d'erreurs des champs invalides
        });
      } else {
         
          const machine = await Machine.build({ // on créer l'objet
           nom : req.body.nom,
           tarif : req.body.tarif,
          });
        
          await machine.save();                 // on le sauve en BDD
          res.redirect("/catalog/machines");            // on redirige vers catalogue
          }
        } catch (error){
          next(error);
        }
      },
  ];

exports.machine_update_get = async function (req, res, next) {
  try{
    const user = req.user;
    if (!user) {
      return res.redirect("/login");
    }
    const machine= await Machine.findByPk(req.params.id, { })
  if (machine === null) { // si on ne trouve pas la machine
    next(createError(404, "Machine non trouvée ")); // on renvoie une erreur
  } else {
    console.log(machine)
    res.render("machine_form",{  // on affiche le formulaire de modification
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
    body("tarif", "Veuillez indiquer un tarif.").trim().notEmpty().escape(), // on fait la validation
    async (req, res, next) => {
      try {
        const user = req.user;
    if (!user) {
      return res.redirect("/login");
    }
        const errors = validationResult(req); // on traite les erreurs de validation
        if (!errors.isEmpty())
         {
     
        res.render("machine_update_form", machine, {
          title : "Modification machine ",
          machine : req.body,
          errors : errors.array(),
        });
      }else {
        const machine = await Machine.findByPk(req.params.id);
        machine.nom = req.body.nom; // MaJ des infos en fonction de
        machine.tarif = req.body.tarif; // ce qu'on a reçu dans le formulaire
        await machine.save();
      }
        res.redirect("/catalog/machines"); // avoir avoir sauvegardé, on redirige vers liste machines
    
    } catch (error){
      next(error);
    }
  },
  ];

  exports.machine_delete_get = async function (req, res, next) {
    try{
      const user = req.user;
    if (!user) {
      return res.redirect("/login");
    }
      const machine = await Machine.findByPk(req.params.id,{ // on récupère machine à partir de l'id et..
        include: Utilisation,                               //  les utilisations qui y sont liées 
      });
      if (machine === null){ // si machine non trouvée en bdd, redirection
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
    const user = req.user;
    if (!user) {
      return res.redirect("/login");
    }
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