var admin = require('../app/controllers/admin');

/**
 * Expose routes
 */

module.exports = function (app) {

  app.get('/', admin.index);
  app.get('/admin', admin.admin);
  app.get('/admin/:name', admin.admin)
  app.post('/login', admin.login);
}