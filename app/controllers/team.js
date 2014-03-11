var mongoose = require('mongoose')
var Team = mongoose.model("Team");

/**
 * Load
 */

exports.load = function(req, res, next, id){
  Team.loadById(id, function (err, team) {
    if (err) return next(err)
    if (!team) return next(new Error('not found'))
    req.team = team;
    next();
  });
}

/**
 * Retrieve a team
 */

exports.show = function(req, res) {
    if(typeof req.team != 'undefined'){
      res.render('team/view', {team: req.team});
  } else {
    res.render('team/new');
  }
};

// Show all of the teams
exports.showAll = function(req, res){
    Team.list({ perPage: 10, page: 0 }, function(err, result){
        res.render('team/list', { 
              title: "All teams",
              teams: result  
          });
    });  
};

/**
 * Create team
 */
exports.createForm = function(req, res){
    res.render('team/new', { title: 'Create new team' });
};

exports.create = function(req, res) {
    var team = new Team(req.body);
    team.save(function(err, result) {
        if (err) {
            console.log(err);
            return err;
        }
        else {
            console.log("Team created");
            return res.redirect('/team/' + result._id);
        }
    });
};