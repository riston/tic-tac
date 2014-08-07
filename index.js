var Hapi = require('hapi');
var Good = require('good');
var Boom = require('boom');
var Joi = require('joi');
var Bearer = require('./bearer-auth');
var config = require('config');
var User = require('./handler/user');
var Game = require('./handler/game');

var Users = require('./db/users');

var server = new Hapi.Server(process.env.PORT || config.server.port);

// Register logging
server.pack.register({
    plugin: Good,
    options: {
        console: [ 'request', 'log', 'error', 'info' ]
    }
}, function (err) {
    if (err) {
        console.error(err);
        return;
    }
});

// Register auth handling
server.pack.register({
    plugin: Bearer
}, function (err) {

    if (err) {
        console.error('Problems loading plugin');
        throw err;
    }

    server.auth.strategy('bearer', 'bearer', {

        base64: true,

        validateFunc: function (secret, token, cb) {
            var u = new Users();

            u.findByIdAndToken(secret, token)
            .then(function (user) {

                if (user && user !== null) {

                    return cb(null, user);
                }

                return cb(null, null);
            })
            .catch(function (err) {

                return cb(null, null);
            });

        }
    });
});

// Add routes
server.route({
    method: 'GET',
    path: '/',
    config: {
        auth: 'bearer'
    },

    handler: function (request, replay) {
        replay({ ping: 'pong'});
    }
});

// User resource
server.route(User.register);

// Game resource
server.route(Game.new);

server.route(Game.stats);

server.route(Game.findById);

server.route(Game.move);

server.start(function () {

    server.log([ 'info' ], 'Server started');
});
