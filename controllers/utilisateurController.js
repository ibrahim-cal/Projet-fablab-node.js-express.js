const { Utilisateur, Utilisation} = require("../models/sequelize");
const createError = require("http-errors");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
var session = require("express-session");
const bcrypt = require("bcrypt");
const saltRounds = 10;


exports.utilisateur_list = async function (req, res, next) {
  try {
    const utilisateur_list = await Utilisateur.findAll({
      include : Utilisation,
      order: [["nom", "ASC"]],
    });
    res.render("utilisateur_list", { title: "Voici la liste des utilisateurs :", utilisateur_list, Utilisation });
  } catch (error) {
    next(error);
  }
};

  exports.utilisateur_detail = function (req, res) {
    res.send("NOT IMPLEMENTED: utilisateur detail");
  };

exports.utilisateur_create_get = function (req, res, next) {
  res.render("utilisateur_form", { title: "Creation nouveau compte"});
};
  
  exports.utilisateur_create_post =  [
    (req, res, next) => {
     next();
  },
    body("prenom", "Veuillez indiquer le nom de la utilisateur.").trim().notEmpty().escape(),
    body("nom", "Veuillez indiquer un prenom.").trim().notEmpty().escape(), // nettoyage & restrictions sur champs
    body("email", "Veuillez indiquer un email.").trim().notEmpty().escape(),
    body("mdp", "Veuillez indiquer un mot de passe.").trim().notEmpty().escape(),
    async (req, res, next) => {
      try {
        const errors = validationResult(req); // on traite les erreurs de validation
        if (!errors.isEmpty())
         {
        res.render("utilisateur_form", utilisateur, {// si erreurs dans champs,
          title : "Certains champs sont incorrects ",//on reaffiche formulaire
          utilisateur : req.body,
          errors : errors.array(),
        });
      }else {
        const utilisateur = await Utilisateur.build({
        prenom : req.body.prenom,
        nom : req.body.nom, // recuperation des infos en fonction de
        email : req.body.email, // ce qu'on a reçu dans le formulaire
        passwordHash :  bcrypt.hashSync(req.body.mdp, saltRounds),// on recupere le mdp en version hashée
        
        });
        await utilisateur.save();// sauvegarde des infos dans table utilisateur
      }
        res.redirect("/catalog"); // avoir avoir sauvegardé, on redirige vers page acceuil
    
    } catch (error){
      next(error);
    }
  },
  ];

  exports.utilisateur_update_get = async function (req, res, next) {
    try{
      const utilisateur= await Utilisateur.findByPk(req.params.id, { })
    if (utilisateur === null) { // si on ne trouve pas l'utilisateur
      next(createError(404, "utilisateur non trouvé ")); // on renvoie une erreur
    } else {
      res.render("utilisateur_update",{  //sinon on affiche le formulaire de modification
        title : "Modification utilisateur",
        utilisateur,
      });
    }
  }  catch (error){
    next(error);
  }
    };
  
  exports.utilisateur_update_post =  [
    (req, res, next) => {
     next();
  },
    body("prenom", "Veuillez indiquer le nom de la utilisateur.").trim().notEmpty().escape(),
    body("nom", "Veuillez indiquer un prenom.").trim().notEmpty().escape(), // on fait la validation
    body("email", "Veuillez indiquer un email.").trim().notEmpty().escape(),
    body("mdp", "Veuillez indiquer un mot de passe.").trim().notEmpty().escape(),
    async (req, res, next) => {
      try {
        const errors = validationResult(req); // on traite les erreurs de validation
        if (!errors.isEmpty())
         {
        res.render("utilisateur_update", utilisateur, {
          title : "Modification données utilisateur ",
          utilisateur : req.body,
          errors : errors.array(),
        });
      }else {
        const utilisateur = await Utilisateur.findByPk(req.params.id);
        utilisateur.prenom = req.body.prenom;
        utilisateur.nom = req.body.nom; // MaJ des infos en fonction de
        utilisateur.email = req.body.email; // ce qu'on a reçu dans le formulaire
        const hash =  bcrypt.hashSync(req.body.mdp, saltRounds)
        utilisateur.passwordHash = hash;

        await utilisateur.save();
      }
        res.redirect("/catalog/utilisateurs"); // avoir avoir sauvegardé, on redirige vers liste utilisateurs
    
    } catch (error){
      next(error);
    }
  },
  ];

  exports.login_get = async function (req, res, next) {
    const authenticationFailed = req.session.authenticationFailed;
    delete req.session.authenticationFailed;
    res.render("login", { title: "Login", currentUrl: req.originalUrl, authenticationFailed });
  };
 
  exports.login_post = async function (req, res, next) {

    // quand on soumet le formulaire, on va apeller la méthode 
    // "authenticate" qui va utiliser la stratégie "local" qu'on 
    // a definit
    passport.authenticate("local", (err1, user, info) => {
        if (err1) {
          console.log("++++1")
          return next(err1);
        }
        if (!user) {
          console.log("++++2")// si l'user ne correspond pas, on va mettre à true et rediriger vers login
          req.session.authenticationFailed = true;
          return res.redirect("/utilisateur/login");
        }

        // si user fonctionne, on va régénerer la session. Càd supprimer
        // celle existante et en créer une nouvelle, par sécurité.
        delete req.session.nextUrl;
        req.session.regenerate((err2) => {
          if (err2) {
            console.log("++++3")
            return next(err2);
          }
          req.login(user, (err3) => {
            if (err3) {
              console.log("++++4")
              return next(err3);
            }
            req.session.newlyAuthenticated = true;
            console.log("++++5")
            res.redirect("/catalog");
          });
        });
      })(req, res, next);
    };

    
        exports.logout_get = async function (req, res, next) {
        req.logout();
  req.session.regenerate((err) => {
    if (!err) {
      res.redirect("/");
    } else {
      next(err);
    }
  });
};

    
     