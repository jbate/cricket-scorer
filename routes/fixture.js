var fixture = require('../app/controllers/fixture');

/**
 * Expose routes
 */

module.exports = function (app) {
    app.get('/fixture/new', fixture.createForm);
    app.post('/fixture/new', fixture.create);

    app.get('/fixture/:fixtureId/edit', fixture.editForm);
    app.post('/fixture/:fixtureId', fixture.edit);

    app.get('/fixture/:fixtureId', fixture.show);

    app.get('/fixtures', fixture.showAll);
    
    app.param('fixtureId', fixture.load);
}