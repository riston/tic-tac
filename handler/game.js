var Boom  = require('boom'),
    Joi   = require('joi'),
    Games = require('../db/games'),
    Game  = {};

Game.stats = {
    method: 'GET',
    path: '/games/stats',
    config: {
        auth: 'bearer'
    },

    handler: function (request, replay) {
        var g = new Games(),
            data = {
                id: request.auth.credentials._id
            };

        g.stats()
        .then(function (result) {

            replay(result);
        })
        .catch(function (err) {

            replay(Boom.badRequest('Game creating failed!'));
        });
    }
};

Game.new = {
    method: 'POST',
    path: '/games',
    config: {
        auth: 'bearer'
    },

    handler: function (request, replay) {
        var g = new Games(),
            data = {
                id: request.auth.credentials._id
            };

        g.new(data)
        .then(function (game) {

            replay(game.pop());
        })
        .catch(function (err) {

            replay(Boom.badRequest('Game creating failed!'));
        });
    }
};

Game.findById = {
    method: 'GET',
    path: '/games/{gid}',
    config: {
        auth: 'bearer'
    },

    handler: function (request, replay) {
        var g = new Games(),
        data = {
            id:   request.auth.credentials._id,
            gid:  encodeURIComponent(request.params.gid)
        };

        g.find(data.gid)
        .then(g.printGameObject)
        .then(function (game) {

            replay(game);
        })
        .catch(function (err) {

            request.log([ 'error' ], err.message);
            replay(Boom.badRequest('Problems with making move'));
        });
    }
};

Game.move = {
    method: 'POST',
    path: '/games/{gid}/move',
    config: {
        auth: 'bearer',
        validate: {
            payload: {
                move: Joi.number().min(0).max(9).integer().required()
            }
        },
    },

    handler: function (request, replay) {
        var g = new Games(),
            data = {
                id:   request.auth.credentials._id,
                gid:  encodeURIComponent(request.params.gid),
                move: request.payload.move
            };

        request.log([ 'request', 'info' ], 'Getting the game object');

        g.move(data)
        .then(function (game) {

            // Returns also the mongodb result object as array
            replay(game.shift());
        })
        .error(function (err) {

            console.error(err);
            request.log([ 'error' ], err.message);
            replay(Boom.badRequest('Problems with making move'));
        })
        .catch(function (err) {

            console.error(err);
            request.log([ 'error' ], err.message);
            replay(Boom.badRequest(err.message));
        });


    }
};

module.exports = Game;
