var mongoose = require('mongoose')
var Team = mongoose.model("Team");
var Player = mongoose.model("Player");
var Scorecard = mongoose.model("Scorecard");
var Fixture = mongoose.model("Fixture");

exports.load = function(req, res, next, id){
  Fixture.loadById(id, function (err, fixture) {
    if (err) return next(err)
    if (!fixture) return next(new Error('not found'))
    req.fixture = fixture;
    next();
  });
};

exports.createForm = function(req, res){
    var teamQuery = {
        perPage: 10,
        page: 0
    }
        
    Team.list(teamQuery, function(err, teams){
        res.render('fixture/new', { title: 'Create new fixture', teams: teams });
    });
};

exports.create = function(req, res){
    //save to db
    if(typeof req.param('homeTeam') != 'undefined' && typeof req.param('awayTeam') != 'undefined'){
       var fixture = new Fixture(req.body);
       // Save the new fixture
       fixture.save(function(err, result){
            // Work out batting and bowling teams based on toss
            var tossWinnerId = fixture.tossWinner;
            var tossLoserId = (fixture.homeTeam.toString() == tossWinnerId.toString()) ? fixture.awayTeam : fixture.homeTeam;
            var battingTeamId = (fixture.tossDecision == 'bat') ? tossWinnerId : tossLoserId;
            var bowlingTeamId = (fixture.tossDecision == 'bowl') ? tossWinnerId : tossLoserId;
            
            // Create a blank scorecard (pre-fill batting and bowling teams)
            var emptyScorecard = new Scorecard({ battingTeam: battingTeamId, bowlingTeam: bowlingTeamId});
            
            // Save to database
            emptyScorecard.save(function(){
                // Add this to the fixture
                fixture.scorecards.push(emptyScorecard);
                // And save the fixture again
                fixture.save(function(){
                    res.redirect('/fixture/' + result._id + '/edit');
                });
            });
       });
    } 
};

// Show the edit form
exports.editForm = function(req, res){
    if(req.fixture){
        //console.log(req.fixture);
        Team.list({ perPage: 10, page: 0 }, function(err, teams){
            var playerQuery = {
                perPage: 10,
                page: 0,
                criteria: { team: req.fixture.scorecards[0].battingTeam._id }
            }
            Player.list(playerQuery, function(err, players){
                return res.render('fixture/edit', { title: 'Edit fixture', fixture: req.fixture, teams: teams, players: players });
            });
        });
    }
};

// Edit the fixture
exports.edit = function(req, res){
    if(req.fixture){
        // Update the fixture details
        Fixture.findByIdAndUpdate(req.fixture._id, req.body.fixture, function(err, fixture){
            
            // Only save rows of an innings that have a player
            var innings = [];
            for(var i = 0; i < req.body.scorecard.innings.length; i++){
                // If player isn't empty, push to temp array
                if(req.body.scorecard.innings[i].player != ""){
                    innings.push(req.body.scorecard.innings[i]);
                }
            }
            console.log(innings);
            // Overwrite innings with temp array
            req.body.scorecard.innings = innings;
            // Calculate the innings score
            req.body.scorecard.total = calculateInningsScore(req.body.scorecard);

            // Work out batting and bowling teams based on toss
            var tossWinnerId = fixture.tossWinner;
            var tossLoserId = (fixture.homeTeam.toString() == tossWinnerId.toString()) ? fixture.awayTeam : fixture.homeTeam;
            var battingTeamId = (fixture.tossDecision == 'bat') ? tossWinnerId : tossLoserId;
            var bowlingTeamId = (fixture.tossDecision == 'bowl') ? tossWinnerId : tossLoserId;
            req.body.scorecard.battingTeam = battingTeamId;
            req.body.scorecard.bowlingTeam = bowlingTeamId;

            // Finally update the scorecard details
            Scorecard.findByIdAndUpdate(req.fixture.scorecards[0]._id, req.body.scorecard, function(err, resultt){
                return res.redirect('/fixture/' + req.fixture._id + "/edit");
            });
        });
    }
};

function calculateInningsScore(scorecard){
    var score = 0;
    for(var i = 0; i < scorecard.innings.length; i ++){
        score += parseInt(scorecard.innings[i].score) || 0;
    }
    score += parseInt(scorecard.extras.wides) || 0;
    score += parseInt(scorecard.extras.noBalls) || 0;
    score += parseInt(scorecard.extras.byes) || 0;
    score += parseInt(scorecard.extras.legByes) || 0;
    score += parseInt(scorecard.extras.pens) || 0;
    return score;
}

// Show the fixture
exports.show = function(req, res){
  	console.log(req.fixture.scorecards);
    res.render('fixture/view', { 
              title: req.fixture.homeTeam.shortName + " vs. " + req.fixture.awayTeam.shortName,
              fixture: req.fixture  
          });
};