var mongoose = require('mongoose');

//create schema for blog post
var teamSchema = new mongoose.Schema({
  name:  { type: String, unique: true },
  shortName: String,
  ground:   String
  /*,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }*/
});

teamSchema.virtual('name.full').get(function () {
    return this.name.first + ' ' + this.name.last;
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
    console.log("Loading " + name)
    this.findOne({ shortName : name })
      .exec(cb)
  }
}
//compile schema to model
mongoose.model('Team', teamSchema);