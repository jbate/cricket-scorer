var mongoose = require('mongoose');

//create schema for player
var playerSchema = new mongoose.Schema({
  name: {
    first: String,
    last: String,
    initials: String
  },
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
  }
}
//compile schema to model
mongoose.model('Player', playerSchema);