var mongoose = require('mongoose');

//create schema for scorecard
var scorecardSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  toss: { type: String, default: "", trim: true },
  homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  innings: [{
    order: Number,
    score: { type: Number, default: 0 }, 
    howOut: { type: String, default: "not out" }, 
    balls: { type: Number, default: 0 },
    mins: { type: Number, default: 0 }, 
    fours: { type: Number, default: 0 }, 
    sixes: { type: Number, default: 0 },
    player: { type : mongoose.Schema.ObjectId, ref: 'Player', required: true }
  }],
  createdDate: { type: Date, default: Date.now },
  modifiedDate: Date
});

scorecardSchema.virtual('innings.strikeRate').get(function () {
    return Math.round(this.innings.score / this.innings.balls * 100).toFixed(2);
});

scorecardSchema.set("collection", "scorecardcollection");

// Won't work with update
var validatePresenceOf = function(value) {
    console.log(value);
    return value && value.length;
};

scorecardSchema.path("innings").validate(validatePresenceOf, "Name cannot be blank");

scorecardSchema.pre('save', function (next) {
  this.modifiedDate = new Date.now();
  next();
});

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
    this.findOne({ _id : id }).populate(population).sort('innings.order')
      .exec(cb)
  }
}
//compile schema to model
mongoose.model('Scorecard', scorecardSchema);