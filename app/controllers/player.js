var mongoose = require('mongoose')
var Player = mongoose.model("Player");
var Team = mongoose.model("Team");

/**
 * Create player
 */
exports.createForm = function(req, res){
    var options = {
        perPage: 10,
        page: 0
    }
    Team.list(options, function(err, result){
        res.render('player/new', { title: 'Create new player', teams: result });
    });
};

exports.create = function(req, res) {
    var player = new Player(req.body);
    player.save(function(err) {
        if (err) {
            console.log(err);
            return err;
        }
        else {
            console.log("Player created");
            return res.redirect('/player/new');
        }
    });
};