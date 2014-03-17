var player = require('../app/controllers/player');

/**
 * Expose routes
 */

module.exports = function (app) {
    app.param('playerId', player.load);

	app.get('/player/new', player.createForm);
    app.post('/player/new', player.create);

	app.get('/player/:playerId/edit', player.editForm);
    app.post('/player/:playerId', player.edit);

    app.get('/player/:playerId', player.show);
    app.get('/players', player.showAll);
}