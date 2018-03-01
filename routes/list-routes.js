const express = require("express");
const List = require("../models/list");
const TYPES = require("../models/list-types");
const router = express.Router();
const { ensureLoggedIn } = require("connect-ensure-login");


// route to display form to create new list
router.get("/new", (req, res) => {
  res.render("lists/new", { types: TYPES });
});


// route to handle list submission
router.post("/new", (req, res, next) => {
  const newList = new List({
    // the first title is from the schema
    // req.body is from body parser
    // title is from the name attribute in the form
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    // We're assuming a user is logged in here
    // If they aren't, this will throw an error
    _creator: req.user._id
  });

  // Redirect User //
  // We have two possible scenarios for our redirect:
  // There was an error saving the list - Show the user the new campaign form again.
  // The save succeeded - Redirect them to a list show page.

  newList.save(err => {
    if (err) {
      res.render("lists/new", { list: newList, types: TYPES });
      console.log(err);
    } else {
      res.redirect("/dashboard");
    }
  });
});

// show individual routes
router.get('/:id', (req, res, next) => {
  List.findById(req.params.id, (err, list) => {
    if (err){ return next(err); }

    list.populate('_creator', (err, list) => {
      if (err){ return next(err); }
      res.locals.user = res.user;
      return res.render('lists/show', { 
        list,
        user: req.user 
      });
    });
  });
});


// display edit list
router.get('/lists/:id/', ensureLoggedIn('/login'), (req, res, next) => {
  List.findById(req.params.id, (err, list) => {
    if (err)       { return next(err) }
    if (!list) { return next(new Error("404")) }
    return res.render('lists/update', { list, types: TYPES })
    // res.send("test");
  });
});


// handle update list form submission
router.post('/:id/update', ensureLoggedIn('/login'), (req, res, next) => {
  const updates = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
  };

  List.findByIdAndUpdate(req.params.id, updates, (err, list) => {
    if (err) {
      return res.render('lists/update', {
        list,
        errors: list.errors
      });
    }
    if (!list) {
      return next(new Error('404'));
    }
    return res.redirect('/dashboard');
  });
});




module.exports = router;