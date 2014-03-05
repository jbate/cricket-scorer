var scorecard = require('../app/controllers/scorecard');

/**
 * Expose routes
 */

module.exports = function (app) {
    app.get('/scorecard/new', scorecard.createForm);
    app.post('/scorecard/new', scorecard.create);

    app.get('/scorecard/:scorecardId/edit', scorecard.editForm);
    app.post('/scorecard/:scorecardId', scorecard.edit);

    app.get('/scorecard/:scorecardId', scorecard.show);
    
    app.param('scorecardId', scorecard.load);
}