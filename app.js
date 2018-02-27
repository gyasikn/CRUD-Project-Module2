const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// configure passport strategy and bcrypt
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const bcrypt = require("bcrypt");
// config express layouts / mongoose
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
// config authentication / authorization
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
// database connection
mongoose.connect("mongodb://localhost:27017/crud-project");

// controllers
const authRoutes = require("./routes/authentication");
const pageRoutes = require("./routes/page-routes");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// express layouts
app.set("layout", "landing-page");
app.use(expressLayouts);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// =========== SESSIONS ============== //

app.use(session({
    secret: "crudproject2",
    resave: false,
    saveUninitialize: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));


// ======================================== PASSPORT CONFIGURATION ========================================= //


// ========== LOCAL STRATEGY FOR PASSPORT ============= //
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// ========== SIGNING UP =============== //
passport.use('local-signup', new LocalStrategy(
  { passReqToCallback: true },
  (req, username, password, next) => {
    // To avoid race conditions
    process.nextTick(() => {
        User.findOne({
            'username': username
        }, (err, user) => {
            if (err){ return next(err); }

            if (user) {
                return next(null, false);
            } else {
                // Destructure the body
                const { username, email, description, password } = req.body;
                const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                const newUser = new User({
                  username,
                  email,
                  description,
                  password: hashPass
                });
                newUser.save((err) => {
                    if (err){ next(err); }
                    return next(null, newUser);
                });
            }
        });
    });
}));

// ========== LOGGING IN =============== //
passport.use('local-login', new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }
    return next(null, user);
  });
}));

// INITIALIZE
app.use(passport.initialize());
app.use(passport.session());



app.use( (req, res, next) => {
  if (typeof(req.user) !== "undefined"){
    res.locals.userSignedIn = true;
  } else {
    res.locals.userSignedIn = false;
  }
  next();
});


// ==================================== END OF PASSPORT CONFIGURATION ======================================== //



// routes
app.use("/", authRoutes);
app.use("/", pageRoutes);




// =========================== ERROR HANDLING ========================== //

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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