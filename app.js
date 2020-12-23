const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const passport = require("passport");
const path = require('path');
const session = require("express-session");

const LocalStrategy = require("passport-local").Strategy;

const { User } = require("./models/user");
const Equipement = require("./models/equipement");
const catalogRouter = require("./routes/catalog");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");


require("./populatedb");

const app = express();

const cookieSigningKey = "My secured signing key";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(cookieSigningKey));
app.use(
  session({ secret: cookieSigningKey, saveUninitialized: false, resave: false })
);

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
// pauseStream is needed because passport.deserializeUser uses async.
app.use(passport.session({ pauseStream: true }));
passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const user = await User.findByPk(email);
      if (user && (await user.validPassword(password))) {
        done(null, user);
      } else {
        return done(null, false, { message: "Email ou mot de passe incorrect" });
      }
    } catch (error) {
      done(error);
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.email);
});
passport.deserializeUser(async (email, done) => {
  try {
    const user = await User.findByPk(email, {
      include: { all: true, nested: true },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
