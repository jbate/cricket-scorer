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
        Team.list({ perPage: 10, page: 0 }, function(err, teams){
            Player.list({
                perPage: 10,
                page: 0,
                criteria: { team: req.fixture.scorecards[0].battingTeam._id }
            }, 
            function(err, batters){
                Player.list({
                    perPage: 10,
                    page: 0,
                    criteria: { team: req.fixture.scorecards[0].bowlingTeam._id }
                }, 
                function(err, bowlers){
                        return res.render('fixture/edit', { title: 'Edit fixture', fixture: req.fixture, teams: teams, availableBatters: batters, availableBowlers: bowlers });
                });
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
            var batting = [];
            for(var i = 0; i < req.body.scorecard.batting.length; i++){
                // If player isn't empty, push to temp array
                if(req.body.scorecard.batting[i].player != ""){
                    batting.push(req.body.scorecard.batting[i]);
                }
            }
            // Overwrite innings with temp array
            req.body.scorecard.batting = batting;

            // Only save rows of an innings that have a player
            var bowling = [];
            for(var i = 0; i < req.body.scorecard.bowling.length; i++){
                // If player isn't empty, push to temp array
                if(req.body.scorecard.bowling[i].player != ""){
                    bowling.push(req.body.scorecard.bowling[i]);
                }
            }
            // Overwrite innings with temp array
            req.body.scorecard.bowling = bowling;

            // Calculate the innings score
            req.body.scorecard.total = calculateInningsScore(req.body.scorecard);
            // Calculate the innings wickets lost
            req.body.scorecard.wicketsLost = calculateInningsWicketsLost(req.body.scorecard);

            // Work out batting and bowling teams based on toss
            var tossWinnerId = fixture.tossWinner;
            var tossLoserId = (fixture.homeTeam.toString() == tossWinnerId.toString()) ? fixture.awayTeam : fixture.homeTeam;
            var battingTeamId = (fixture.tossDecision == 'bat') ? tossWinnerId : tossLoserId;
            var bowlingTeamId = (fixture.tossDecision == 'bowl') ? tossWinnerId : tossLoserId;
            req.body.scorecard.battingTeam = battingTeamId;
            req.body.scorecard.bowlingTeam = bowlingTeamId;

            // Finally update the scorecard details
            Scorecard.findByIdAndUpdate(req.fixture.scorecards[0]._id, req.body.scorecard, function(err, result){
                return res.redirect('/fixture/' + req.fixture._id + "/edit");
            });
        });
    }
};

function calculateInningsScore(scorecard){
    var score = 0;
    for(var i = 0; i < scorecard.batting.length; i ++){
        score += parseInt(scorecard.batting[i].score) || 0;
    }
    score += parseInt(scorecard.extras.wides) || 0;
    score += parseInt(scorecard.extras.noBalls) || 0;
    score += parseInt(scorecard.extras.byes) || 0;
    score += parseInt(scorecard.extras.legByes) || 0;
    score += parseInt(scorecard.extras.pens) || 0;
    return score;
}

function calculateInningsWicketsLost(scorecard){
    var wicketsLost = 0;
    for(var i = 0; i < scorecard.batting.length; i ++){
        wicketsLost += (scorecard.batting[i].howOut != "not out") ? 1 : 0;
    }
    return wicketsLost;
}

// Show the fixture
exports.show = function(req, res){
  	console.log(req.fixture.scorecards);
    res.render('fixture/view', { 
              title: req.fixture.homeTeam.shortName + " vs. " + req.fixture.awayTeam.shortName,
              fixture: req.fixture  
          });
};

// Show all of the fixtures
exports.showAll = function(req, res){
    Fixture.list({ perPage: 10, page: 0 }, function(err, result){
        res.render('fixture/list', { 
              title: "All fixtures",
              fixtures: result  
          });
    });  
};