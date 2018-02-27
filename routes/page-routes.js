const express = require("express");
const pageRoutes = express.Router();


// user dashboard route - after login
pageRoutes.get('/login', (req, res, next) => {
  res.render('layouts/dashboard');
});




module.exports = pageRoutes;