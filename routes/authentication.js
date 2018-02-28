const express = require("express");
const authRoutes = express.Router();
const passport = require('passport');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

// require user model
const User = require("../models/user");


// login form display
authRoutes.get('/login', ensureLoggedOut(), (req, res, next) => {
  res.render('authentication/login');
});


// login form submission
authRoutes.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));


// sign up form display
authRoutes.get('/signup', ensureLoggedOut(), (req, res, next) => {
  res.render('authentication/signup');
});


// sign up form submission
authRoutes.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
  successRedirect: '/dashboard', 
  failureRedirect: '/signup'
}));


// route to handle logging out
authRoutes.get('/logout', ensureLoggedIn('/login'), (req, res, next) => {
  req.logout();
  res.redirect('/');
});


module.exports = authRoutes;