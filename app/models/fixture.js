var mongoose = require('mongoose');

//create schema for scorecard
var fixtureSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  tossWinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  tossDecision: { type: String, default: "", trim: true },
  matchType: { type: String, default: "", trim: true },
  homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  scorecards: [{ type: mongoose.Schema.ObjectId, ref: 'Scorecard' }],
  createdDate: { type: Date, default: Date.now },
  modifiedDate: Date
});

fixtureSchema.set("collection", "fixturecollection");

// Won't work with update
var validatePresenceOf = function(value) {
    return value && value.length;
};

fixtureSchema.path("matchType").validate(validatePresenceOf, "Type cannot be blank");

fixtureSchema.pre('save', function (next) {
  this.modifiedDate = new Date;
  next();
});

/**
 * Statics
 */
var population = 'scorecards homeTeam awayTeam tossWinner';

fixtureSchema.statics = {
  
  /**
   * Find fixture by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  loadById: function (id, cb) {
    this.findOne({ _id : id })
    .populate(population)
         .exec(function(err, fixture){
             mongoose.model("Scorecard").populate(fixture.scorecards, 'battingTeam bowlingTeam batting.player bowling.player',
                   function(err, data){
                        cb(null, fixture);
                   }  
             );    
        });
  },

  /**
   * List fixtures
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {};

    this.find(criteria)
      .populate(population)
      .sort('createdDate') // sort by created date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }
}
//compile schema to model
mongoose.model('Fixture', fixtureSchema);