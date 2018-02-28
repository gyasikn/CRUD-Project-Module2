const List = require('../models/list.js');

function authorizeList(req, res, next){
  List.findById(req.params.id, (err, list) => {
    // If there's an error, forward it
    if (err) { return next(err) }
    // If there is no list, return a 404
    if (!list){ return next(new Error('404')) }
    // If the list belongs to the user, next()
    if (list.belongsTo(req.user)){
      return next()
    } else {
      return res.redirect(`/lists/${list._id}`)
    // Otherwise, redirect
      return res.redirect(`/lists/${list._id}`)
    }
  });
}


function checkOwnership(req, res, next){
  List.findById(req.params.id, (err, list) => {
    if (err){ return next(err) }

    if (!list){ return next(new Error('404')) }

    if (list.belongsTo(req.user)){
      res.locals.listIsCurrentUsers = true;
    } else {
      res.locals.listIsCurrentUsers = false;
    }
    return next()
  });
}


module.exports = {
  authorizeList, 
  checkOwnership
}