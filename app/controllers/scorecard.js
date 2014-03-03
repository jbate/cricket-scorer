var mongoose = require('mongoose')
var Team = mongoose.model("Team");
var Player = mongoose.model("Player");
var Scorecard = mongoose.model("Scorecard");

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
  	
    Scorecard.loadById('53139d67f258ec1ee40aa9fb', function(err, result){
          res.render('scorecard/view', { 
              title: result.homeTeam.shortName + " vs. " + result.awayTeam.shortName,
              homeTeam: result.homeTeam, 
              awayTeam: result.awayTeam, 
              innings: result.innings 
          });
    });

  }
};