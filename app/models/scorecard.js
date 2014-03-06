var mongoose = require('mongoose');

//create schema for scorecard
var scorecardSchema = new mongoose.Schema({
  battingTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  bowlingTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  order: { type: Number, default: 0 },
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
  extras: {
    wides: { type: Number, default: 0 },
    noBalls: { type: Number, default: 0 },
    byes: { type: Number, default: 0 },
    legByes: { type: Number, default: 0 },
    pens: { type: Number, default: 0 }
  },
  wicketsLost: { type: Number, default: 0 },
  overs: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  createdDate: { type: Date, default: Date.now },
  modifiedDate: Date
});

scorecardSchema.virtual('innings.strikeRate').get(function () {
    return Math.round(this.innings.score / this.innings.balls * 100).toFixed(2);
});

scorecardSchema.virtual('runRate').get(function () {
    return (this.total / this.overs).toFixed(2);
});

scorecardSchema.virtual('extrasTotal').get(function () {
    var score = parseInt(this.extras.wides) || 0;
    score += parseInt(this.extras.noBalls) || 0;
    score += parseInt(this.extras.byes) || 0;
    score += parseInt(this.extras.legByes) || 0;
    score += parseInt(this.extras.pens) || 0;
    return score;
});

scorecardSchema.virtual('extrasString').get(function () {
    var stringArr = [];
    if(!isNaN(parseInt(this.extras.wides))){
      stringArr.push("w " + parseInt(this.extras.wides))
    }
    if(!isNaN(parseInt(this.extras.noBalls))){
      stringArr.push("nb " + parseInt(this.extras.noBalls))
    }
    if(!isNaN(parseInt(this.extras.byes))){
      stringArr.push("b " + parseInt(this.extras.byes))
    }
    if(!isNaN(parseInt(this.extras.legByes))){
      stringArr.push("lb " + parseInt(this.extras.legByes))
    }
    if(!isNaN(parseInt(this.extras.pens))){
      stringArr.push("pens " + parseInt(this.extras.pens))
    }
    if(stringArr.length > 0){
        return "(" + stringArr.join(", ") + ")";
    }
    return "";
});

scorecardSchema.set("collection", "scorecardcollection");

// Won't work with update
var validatePresenceOf = function(value) {
    console.log(value);
    return value && value.length;
};

//scorecardSchema.path("innings").validate(validatePresenceOf, "Name cannot be blank");

scorecardSchema.pre('save', function (next) {
  this.modifiedDate = new Date;
  next();
});

/**
 * Statics
 */
var population = 'battingTeam bowlingTeam innings.player';

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