const express = require("express");
const List = require("../models/list");
const TYPES = require("../models/list-types");
const router = express.Router();
const { ensureLoggedIn } = require("connect-ensure-login");
const {
  authorizeList,
  checkOwnership
} = require("../middleware/list-authorization");



// route to display form to create new list
router.get("/new", (req, res) => {
  res.render("lists/new", { types: TYPES });
});


// route to handle list submission
router.post("/", ensureLoggedIn("/login"), (req, res, next) => {
  const newList = new List({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    // We're assuming a user is logged in here
    // If they aren't, this will throw an error
    _creator: req.user._id
  });

  // Redirect User //
  // We have two possible scenarios for our redirect:
  // There was an error saving the campaign - Show the user the new campaign form again.
  // The save succeeded - Redirect them to a campaign show page.

  newList.save(err => {
    if (err) {
      res.render("lists/new", { list: newList, types: TYPES });
    } else {
      res.redirect(`/lists/${newList._id}`);
    }
  });
});

// show individual routes
router.get('/:id', checkOwnership, (req, res, next) => {
  List.findById(req.params.id, (err, list) => {
    if (err){ return next(err); }

    list.populate('_creator', (err, list) => {
      if (err){ return next(err); }
      return res.render('list/show', { list });
    });
  });
});


// display edit campaign
router.get('/:id/edit', ensureLoggedIn('/login'), authorizeList, (req, res, next) => {
  List.findById(req.params.id, (err, list) => {
    if (err)       { return next(err) }
    if (!list) { return next(new Error("404")) }
    return res.render('lists/edit', { list, types: TYPES })
  });
});


// handle edit campaign form submission
router.post('/:id', ensureLoggedIn('/login'), authorizeList, (req, res, next) => {
  const updates = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
  };

  List.findByIdAndUpdate(req.params.id, updates, (err, list) => {
    if (err) {
      return res.render('lists/edit', {
        list,
        errors: list.errors
      });
    }
    if (!list) {
      return next(new Error('404'));
    }
    return res.redirect(`/lists/${list._id}`);
  });
});




module.exports = router;