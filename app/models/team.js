var mongoose = require('mongoose');

//create schema for team
var teamSchema = new mongoose.Schema({
  name:  { type: String, unique: true },
  shortName: String,
  ground:   String
});

teamSchema.path('name').required(true, 'Name cannot be blank');

teamSchema.path('name').index({ unique: true });

teamSchema.set("collection", "teamcollection");

/**
 * Statics
 */

teamSchema.statics = {

  /**
   * Find team by shortName
   *
   * @param {ObjectId} name
   * @param {Function} cb
   * @api private
   */

  load: function (name, cb) {
    this.findOne({ shortName: name })
      .exec(cb)
  },

   /**
   * Find team by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  loadById: function (id, cb) {
    this.findOne({ _id: id })
      .exec(cb)
  },

  /**
   * List teams
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {};

    this.find(criteria)
      .sort('name') // sort by name
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }
}
//compile schema to model
mongoose.model('Team', teamSchema);
