var mongoClient = require('mongodb').MongoClient;
var collection  = require('mongodb').Collection;
var config      = require('config');
var Promise     = require('bluebird');

// We promisify everything. Bluebird add ***Async function which return promises.
Promise.promisifyAll(collection.prototype);
Promise.promisifyAll(mongoClient);

//In mongodb cursor is not built from protoype I use to promisify it each time. Not necessary if you don't use cursors.
collection.prototype._find = collection.prototype.find;
collection.prototype.find = function() {
  var cursor = this._find.apply(this, arguments);
  cursor.toArrayAsync = Promise.promisify(cursor.toArray, cursor);
 return cursor;
};

module.exports = mongoClient.connectAsync(config.mongodb.url);
