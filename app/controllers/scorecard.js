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
  res.render('scorecard/new', { title: 'Create new scorecard' });
};

exports.create = function(req, res){
    //save to db
    if(typeof req.param('homeTeam') != 'undefined' && typeof req.param('awayTeam') != 'undefined'){
       res.redirect('/scorecard/' + req.param('homeTeam') + '/' + req.param('awayTeam'));
    } 
};

exports.editForm = function(req, res){
    if(req.scorecard){
        var options = {
            perPage: 10,
            page: 0
        }
        Team.list(options, function(err, result){
            return res.render('scorecard/edit', { title: 'Edit scorecard', scorecard: req.scorecard, teams: result });
        });
    }
};

exports.edit = function(req, res){
    if(req.scorecard){
        Scorecard.findByIdAndUpdate(req.scorecard._id, req.body, function(err, result){
            console.log(result);
            return res.redirect('/scorecard/' + req.scorecard._id);
        });
    }
};

exports.show = function(req, res){
  	// Mock result (without database)
    /*var innings = [
      {player: "Bate", order: 1, score: 65, balls: 97, fours: 8}, 
      {player: "Carberry", order: 2, score: 20, howOut: "LBW", balls: 19, fours: 2, sixes: 1}, 
      {player: "Adams", order: 3, score: 30, balls: 48}
    ];
    
    for(var i = 0; i < innings.length; i++){
        (function(i) {
          Player.loadByLastName(innings[i].player, function(err, result){
                  console.log(innings[i].player);
                  console.log(result._id);
                  innings[i].player = result._id;
                  if(i == (innings.length - 1)){
                    addToScorecard();
                  }
              });
        })(i);
        
      }// end loop

        function addToScorecard(){
          
    //create new model
    var scorecard = new Scorecard({innings: innings});
    
    // Load home team
    Team.load(req.param('home'), function(err, result){
        var homeTeam = result;

        // Load away team
        Team.load(req.param('away'), function(err, result){
          var awayTeam = result;
          scorecard.homeTeam = homeTeam._id;
          scorecard.awayTeam = awayTeam._id;
          //scorecard.save(function (err) {
              if (err) {
                return err;
              }
              else {
                console.log("Scorecard saved");
              }
          });//
          console.log(scorecard);

          res.render('scorecard/view', { 
              title: homeTeam.shortName + " vs. " + awayTeam.shortName,
              homeTeam: homeTeam, 
              awayTeam: awayTeam, 
              innings: innings 
          });
      });
    }); 
  } //end fn 
 */
    //var teamIds = ['5311f6b281afaeb7ad3287da','5311f6b281afaeb7ad3287db'];
    Scorecard.loadById('53139d67f258ec1ee40aa9fb', function(err, result){
          res.render('scorecard/view', { 
              title: result.homeTeam.shortName + " vs. " + result.awayTeam.shortName,
              scorecard: result 
          });
    });
};