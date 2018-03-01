const express = require("express");
const pageRoutes = express.Router();
const { ensureLoggedIn } = require("connect-ensure-login");

const List = require('../models/list');


// route to landing page
pageRoutes.get('/', (req, res, next) => {
  res.render("landing-page");
});


// user dashboard route - after login
pageRoutes.get('/dashboard', ensureLoggedIn(), (req, res, next) => {
    List
      .find({})
      .populate('_creator')
      .exec((err, lists) => {
      res.render('dashboard', { lists });
  });
});


module.exports = pageRoutes;