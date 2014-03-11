var mongoose = require('mongoose');

//create schema for player
var playerSchema = new mongoose.Schema({
  name: {
    first: String,
    last: String,
    initials: String
  },
  bat: { type: String, default: "" },
  bowl: { type: String, default: "" },
  bowlStyle: { type: String, default: "" },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
});

playerSchema.virtual('name.full').get(function () {
    return this.name.first + ' ' + this.name.last;
});

playerSchema.set("collection", "playercollection");

/**
 * Statics
 */

playerSchema.statics = {

  /**
   * Find player by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  loadById: function (id, cb) {
    this.findOne({ _id : id })
      .exec(cb)
  },

  /**
   * Find player by lastName
   *
   * @param {ObjectId} lastName
   * @param {Function} cb
   * @api private
   */

  loadByLastName: function (lastName, cb) {
    this.findOne({ 'name.last' : lastName })
      .exec(cb)
  },

  /**
   * List players
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {};

    this.find(criteria)
      .populate("team")
      .sort('name.last') // sort by name
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }
}
//compile schema to model
mongoose.model('Player', playerSchema);