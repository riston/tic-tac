var Boom = require('boom'),
    Users = require('../db/users'),
    User = {};

User.register = {
    method: 'POST',
    path: '/users',

    handler: function (request, replay) {
        var u = new Users();

        u.new({
            email: 'random@random.org'
        })
        .then(function (user) {

            replay(user.pop());
        })
        .catch(function (err) {

            replay(Boom.badRequest('Database problem creating new user'));
        });
    }
};

module.exports = User;
