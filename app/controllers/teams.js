var mongoose = require('mongoose')
var Team = mongoose.model("Team");

/**
 * Load
 */

exports.load = function(req, res, next, teamName){
  Team.load(teamName, function (err, team) {
    if (err) return next(err)
    if (!team) return next(new Error('not found'))
    req.team = team;
    next();
  });
}

/**
 * Retrieve a team
 */

exports.getTeam = function(req, res) {
    if(typeof req.team != 'undefined'){
      
      //create new model
      var team = new Team({name: "Leicestershire", shortName: "Leics", 
                                ground: "Grace Road"});

      //save model to MongoDB
      team.save(function (err) {
        if (err) {
          return err;
        }
        else {
          console.log("Team saved");
        }
      });
      

      res.render('team', {team: req.team});
  } else {
    res.render('team');
  }
};