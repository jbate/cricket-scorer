var teams = require('../app/controllers/teams');

/**
 * Expose routes
 */

module.exports = function (app) {
    app.param('name', teams.load);
    app.get('/teams/:name', teams.getTeam);
}