var mongoose = require('mongoose')
var Team = mongoose.model("Team");

exports.new = function(req, res){
  res.render('scorecard/new', { title: 'Create new scorecard' });
};

exports.load = function(req, res){
  // Load from "/scorecard/new" view
  if(typeof req.param('homeTeam') != 'undefined' && typeof req.param('awayTeam') != 'undefined'){
	   res.redirect('/scorecard/' + req.param('homeTeam') + '/' + req.param('awayTeam'));
  } 
  // Load from RESTful URL
  else {
  	// Mock result (without database)
    var innings = [
      {name:"James", score: 65, balls: 97, fours: 8}, 
      {name: "Jess", score: 20, howOut: "LBW", balls: 19, fours: 2, sixes: 1}, 
      {name: "Frankie", score: 30, balls: 48}
    ];
    
    // Load home team
    Team.load(req.param('home'), function(err, result){
        var homeTeam = result;
        
        // Load away team
        Team.load(req.param('away'), function(err, result){
          var awayTeam = result;

          res.render('scorecard/view', { 
              title: homeTeam.shortName + " vs. " + awayTeam.shortName,
              homeTeam: homeTeam, 
              awayTeam: awayTeam, 
              innings: innings 
          });
      });
    }); 
  }
};