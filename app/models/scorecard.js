var mongoose = require('mongoose');

//create schema for scorecard
var scorecardSchema = new mongoose.Schema({
  battingTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  bowlingTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  order: { type: Number, default: 0 },
  batting: [{
    order: Number,
    score: { type: Number, default: 0 }, 
    howOut: { type: String, default: "not out" }, 
    balls: { type: Number, default: 0 },
    mins: { type: Number, default: 0 }, 
    fours: { type: Number, default: 0 }, 
    sixes: { type: Number, default: 0 },
    player: { type : mongoose.Schema.ObjectId, ref: 'Player', required: true }
  }],
  bowling: [{
    order: Number,
    overs: { type: Number, default: 0 }, 
    maidens: { type: String, default: 0 }, 
    wickets: { type: Number, default: 0 },
    runs: { type: Number, default: 0 }, 
    wides: { type: Number, default: 0 }, 
    noBalls: { type: Number, default: 0 },
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

scorecardSchema.virtual('batting.strikeRate').get(function () {
    return Math.round(this.batting.score / this.batting.balls * 100).toFixed(2);
});

scorecardSchema.virtual('runRate').get(function () {
    return parseFloat((this.total / this.overs).toFixed(2)) || 0.00;
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
    if(!isNaN(parseInt(this.extras.wides)) && parseInt(this.extras.wides) > 0){
      stringArr.push("w " + parseInt(this.extras.wides))
    }
    if(!isNaN(parseInt(this.extras.noBalls)) && parseInt(this.extras.noBalls) > 0){
      stringArr.push("nb " + parseInt(this.extras.noBalls))
    }
    if(!isNaN(parseInt(this.extras.byes)) && parseInt(this.extras.byes) > 0){
      stringArr.push("b " + parseInt(this.extras.byes))
    }
    if(!isNaN(parseInt(this.extras.legByes)) && parseInt(this.extras.legByes) > 0){
      stringArr.push("lb " + parseInt(this.extras.legByes))
    }
    if(!isNaN(parseInt(this.extras.pens)) && parseInt(this.extras.pens) > 0){
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

scorecardSchema.pre('save', function (next) {
  this.modifiedDate = new Date;
  next();
});

/**
 * Statics
 */
var population = 'battingTeam bowlingTeam batting.player bowling.player';

scorecardSchema.statics = {
  
  /**
   * Find scorecard by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  loadById: function (id, cb) {
    this.findOne({ _id : id }).populate(population).sort('batting.order')
      .exec(cb)
  }
}
//compile schema to model
mongoose.model('Scorecard', scorecardSchema);