const express = require("express");
const router = express.Router();
const passport = require("passport");
var session = require("express-session");


exports.login_index = async function(req, res, next)  {
    const newlyAuthenticated = req.session.newlyAuthenticated;
    delete req.session.newlyAuthenticated;
    res.render("index", {
      title: "Page d'accueil FabLab",
      user: req.user,
      currentUrl: req.originalUrl,
      newlyAuthenticated,
    });

    
   exports.login_get = async function (req, res)  {
    const authenticationFailed = req.session.authenticationFailed;
    delete req.session.authenticationFailed;
    res.render("login", { title: "Login", 
    currentUrl: req.originalUrl, authenticationFailed });
  
  
  router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err1, user, info) => {
      if (err1) {
        return next(err1);
      }
      if (!user) {
        req.session.authenticationFailed = true;
        return res.redirect("/login");
      }
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
  });
  
  router.get("/logout", (req, res, next) => {
    req.logout();
    req.session.regenerate((err) => {
      if (!err) {
        res.redirect("/");
      } else {
        next(err);
      }
    });
  });