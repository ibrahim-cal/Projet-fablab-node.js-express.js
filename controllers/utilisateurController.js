const { Utilisateur } = require("../models/sequelize");
const createError = require("http-errors");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
var session = require("express-session");


exports.utilisateur_list = function (req, res) {
    res.send("NOT IMPLEMENTED: utilisateur list");
  };

  exports.utilisateur_detail = function (req, res) {
    res.send("NOT IMPLEMENTED: utilisateur detail");
  };

exports.utilisateur_create_get = function (req, res) {
    res.send("NOT IMPLEMENTED: utilisateur create GET");
  };
  
  exports.utilisateur_create_post = function (req, res) {
    res.send("NOT IMPLEMENTED: utilisateur create POST");
  };

  exports.utilisateur_update_get = function (req, res) {
    res.send("NOT IMPLEMENTED: utilisateur update GET");
  };
  
  exports.utilisateur_update_post = function (req, res) {
    res.send("NOT IMPLEMENTED: utilisateur update POST");
  };

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
          return next(err1);
        }
        if (!user) {// si l'user ne correspond pas, on va mettre à true et rediriger vers login
          req.session.authenticationFailed = true;
          return res.redirect("/login");
        }

        // si user fonctionne, on va régénerer la session. Càd supprimer
        // celle existante et en créer une nouvelle, par sécurité.
        delete req.session.nextUrl;
        req.session.regenerate((err2) => {
          if (err2) {
            return next(err2);
          }
          req.login(user, (err3) => {
            if (err3) {
              return next(err3);
            }
            req.session.newlyAuthenticated = true;
            res.redirect("/");
          });
        });
      })(req, res, next);
    };

    /*
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

    */
     