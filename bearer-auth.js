var boom = require('boom');
var hoek = require('hoek');

/**
 * Simple Bearer auth token strategy.
 *
 * If `options.base64` is set to `true`, then it expects a base64 encoded value of SECRET:TOKEN, otherwise
 * it expects the Bearer value to just be the token.
 *    i.e.) Bearer NTJlYjRmZmRmM2M3MjNmZjA1MTEwYmYxOjk5ZWQyZjdmMWRiNjBiZDBlNGY1ZjQ4ZjRhMWVhNWVjMmE4NzU2ZmU=
 *
 *
 * @param server
 * @param {Object} options
 * @from https://github.com/j/hapi-auth-bearer/blob/master/lib/index.js
 *
 * @returns {{authenticate: Function}}
 */
var bearerScheme = function bearerScheme(server, options) {
  hoek.assert(options && 'object' === typeof options, 'Missing Bearer auth strategy options');

  hoek.assert(
    options && 'function' === typeof options.validateFunc,
    'options.validateFunc must be a valid function in Bearer scheme'
  );

  options.base64 = options.base64 || false;

  return {
    authenticate: function (request, reply) {
      var req = request.raw.req;
      var authorization = req.headers.authorization;

      if (!authorization) {
        return reply(boom.unauthorized(null, 'Bearer'));
      }

      var parts = authorization.split(/\s+/);

      if (parts.length !== 2) {
        return reply(boom.badRequest('Bad HTTP authentication header format'));
      }

      if (parts[0] && parts[0].toLowerCase() !== 'bearer') {
        return reply(boom.unauthorized(null, 'Bearer'));
      }

      var createCallback = function(secret, token) {
        return function (err, credentials) {
          if (err) {
            return reply(err, { credentials: credentials, log: { tags: ['auth', 'bearer-auth'], data: err } });
          }

          if (!credentials || (token && (!credentials.token || credentials.token !== token))) {
            return reply(boom.unauthorized('Invalid token', 'Bearer'), { credentials: credentials });
          }

          return reply(null, { credentials: credentials });
        }
      };

      if (options.base64) {
        var tokenParts = new Buffer(parts[1] || '', 'base64').toString('utf8').split(':');
        if (tokenParts.length !== 2) {
          return reply(boom.badRequest('Bad HTTP authentication token value format'));
        }

        return options.validateFunc(tokenParts[0], tokenParts[1], createCallback(tokenParts[0], tokenParts[1]));
      } else {
        return options.validateFunc(parts[1], createCallback(null, parts[1]));
      }
    }
  };
};


exports.register = function (plugin, options, next) {
  plugin.auth.scheme('bearer', bearerScheme);
  next();
};

exports.register.attributes = {
  name: 'hapi-auth-bearer',
  version: '0.0.5'
};
