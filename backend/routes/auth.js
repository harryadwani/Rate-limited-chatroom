const authRepo = require('../helpers/auth');

module.exports = {
  signin: function (app) {
    app.post('/signin', (req, res) => {
      const username = req.body.username;
      authRepo.signInUser(username);
      res.send({
        'status': 'OK'
      });
    });
  }
};