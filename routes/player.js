var player = require('../app/controllers/player');

/**
 * Expose routes
 */

module.exports = function (app) {
    //app.param('name', player.load)
    //app.get('/player/:name', player.showPlayer);
    app.get('/player/new', player.createForm);
    app.post('/player/new', player.create);
}