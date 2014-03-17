var mongoose = require('mongoose')
var Team = mongoose.model("Team");
var Player = mongoose.model("Player");
var Scorecard = mongoose.model("Scorecard");

exports.load = function(req, res, next, id){
  Scorecard.loadById(id, function (err, scorecard) {
    if (err) return next(err)
    if (!scorecard) return next(new Error('not found'))
    req.scorecard = scorecard;
    next();
  });
};

exports.createForm = function(req, res){
  var teamQuery = {
              perPage: 10,
              page: 0
          }
        
    Team.list(teamQuery, function(err, teams){
        res.render('scorecard/new', { title: 'Create new scorecard', teams: teams });
    });
};

exports.create = function(req, res){
    //save to db
    if(typeof req.param('homeTeam') != 'undefined' && typeof req.param('awayTeam') != 'undefined'){
       var scorecard = new Scorecard(req.body);
       scorecard.save(function(err, result){
          console.log(result);
          res.redirect('/scorecard/' + result._id);
       });
    } 
};

// Show the edit form
exports.editForm = function(req, res){
    if(req.scorecard){
          var teamQuery = {
              perPage: 10,
              page: 0
          }
        
        Team.list(teamQuery, function(err, teams){
            var playerQuery = {
                perPage: 10,
                page: 0,
                criteria: { team: req.scorecard.homeTeam._id }
            }
            Player.list(playerQuery, function(err, players){
                return res.render('scorecard/edit', { title: 'Edit scorecard', scorecard: req.scorecard, teams: teams, players: players });
            });
        });
    }
};

// Edit the scorecard
exports.edit = function(req, res){
    if(req.scorecard){
        // Only save rows of an innings that have a player
        var batting = [];
        for(var i = 0; i < req.body.batting.length; i++){
            // If player isn't empty, push to temp array
            if(req.body.batting[i].player != ""){
                batting.push(req.body.batting[i]);
            }
        }
        // Overwrite innings with temp array
        req.body.batting = batting;
        console.log(req.body);
        //Scorecard.findByIdAndUpdate(req.scorecard._id, req.body, function(err, result){
            return res.redirect('/scorecard/' + req.scorecard._id + "/edit");
        //});
    }
};

// Show the scorecard
exports.show = function(req, res){
  	Scorecard.loadById(req.scorecard._id, function(err, result){
          res.render('scorecard/view', { 
              title: result.homeTeam.shortName + " vs. " + result.awayTeam.shortName,
              scorecard: result  
          });
    });
};