var mongoose = require('mongoose');

//create schema for scorecard
var scorecardSchema = new mongoose.Schema({
  date: Date,
  toss: String,
  homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  innings: [{
    order: Number,
    score: Number, 
    howOut: { type: String, default: "not out"}, 
    balls: Number,
    mins: Number, 
    fours: Number, 
    sixes: Number,
    player: { type : mongoose.Schema.ObjectId, ref: 'Player' }
  }],
  createdDate: {type: Date, default: Date.now}
});

scorecardSchema.virtual('innings.strikeRate').get(function () {
    return Math.round(this.innings.score / this.innings.balls * 100).toFixed(2);
});

scorecardSchema.set("collection", "scorecardcollection");

/**
 * Statics
 */
var population = 'homeTeam awayTeam innings.player';

scorecardSchema.statics = {
  
  /**
   * Find scorecard by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  loadById: function (id, cb) {
    this.findOne({ _id : id }).populate(population)
      .exec(cb)
  }
}
//compile schema to model
mongoose.model('Scorecard', scorecardSchema);