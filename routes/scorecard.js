var scorecard = require('../app/controllers/scorecard');

/**
 * Expose routes
 */

module.exports = function (app) {
    app.get('/scorecard/new', scorecard.new);
    app.post('/scorecard/new', scorecard.load);
    app.get('/scorecard/:home/:away', scorecard.load);
}