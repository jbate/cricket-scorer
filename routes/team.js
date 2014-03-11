var team = require('../app/controllers/team');

/**
 * Expose routes
 */

module.exports = function (app) {
    app.param('name', team.load);

    app.get('/team/new', team.createForm);
    app.post('/team/new', team.create);

    app.get('/team/:name', team.getTeam);
}