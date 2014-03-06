var player = require('../app/controllers/player');

/**
 * Expose routes
 */

module.exports = function (app) {
    app.param('playerId', player.load);

    app.get('/player/:playerId', player.show);
    app.get('/player/new', player.createForm);
    app.post('/player/new', player.create);
}