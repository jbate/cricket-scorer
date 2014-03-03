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
    this.findOne({ shortName : name })
      .exec(cb)
  }
}
//compile schema to model
mongoose.model('Team', teamSchema);