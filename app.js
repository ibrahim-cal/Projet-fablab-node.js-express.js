const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const passport = require("passport");
const path = require('path');
const session = require("express-session");

//Mise en place stratégie d’authentification
const LocalStrategy = require("passport-local").Strategy;
const sequelize = require ("./models/sequelizeInstance");
const Utilisateur = require("./models/utilisateur")(sequelize);

const catalogRouter = require("./routes/catalog");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

// Mise en place mécanisme session
const cookieSigningKey = "My secured signing key";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());

// Mise en place mécanisme session
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser(cookieSigningKey));
app.use( // Cookie parser et middleware session configurés avec même clé pour signature cookies
  session({ secret: cookieSigningKey, saveUninitialized: false, resave: true })
);

app.use(express.static(path.join(__dirname, 'public')));


app.use(passport.initialize());
app.use(passport.session({ pauseStream: true }));
passport.use(
  // stratégie locale. Permet de determiner si username ET password
 // correspondent à un utilisateur. Sinon, on va renvoyer message erreur
 new LocalStrategy(async (email, password, done) => {
  try {
    const user = await Utilisateur.findOne({where: {email : email}});
    // on va comparer : email reçu avec les email qu'on a en BDD
    
    if (user) {// si l'email existe, on va alors aller comparer le mdp
       
        const isValid = bcrypt.compareSync(password,user.passwordHash);
        // on va utiliser un outil de bcrypt pour la comparaison des 2 mdp
        if(isValid){
      done(null, user);
    }
   } else {
     // si email/mdp incorrect, on renvoie un message erreur
      return done(null, false, { message: "Email ou mot de passe incorrect" });
    }
  } catch (error) {
    done(error);
  }
})
);

// on va stocker la partie de l'utilisateur à stocker en session
passport.serializeUser((user, done) => {
  done(null, user.email);
});

// méthode qui va être apellée à chaque fois qu’une requête est reçue 
// et qu’un 'email' se trouve dans la session
passport.deserializeUser(async (email, done) => {
  try {
    const user = await Utilisateur.findOne({ where : {email : email}}, {
      include: { all: true, nested: true },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
