const express = require("express");
const pageRoutes = express.Router();


// route to landing page
pageRoutes.get('/', (req, res, next) => {
  res.render("landing-page");
});


// user dashboard route - after login
pageRoutes.get('/dashboard', (req, res, next) => {
  res.render('dashboard');
});


module.exports = pageRoutes;