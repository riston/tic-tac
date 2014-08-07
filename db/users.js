var crypto = require('crypto'),
    ObjectID = require('mongodb').ObjectID,
    Db = require('./init');

function Users () {

    this.name = 'users';
}

Users.prototype.new = function (userData) {
    var _this = this,
        data;

    data = {
        'token': _this.getToken(),
        'email': userData.email,
        'created': new Date(),
        'modified': new Date(),
    };

    return Db.then(function (db) {

        return db.collection(_this.name)
            .insertAsync(data);
    });
};

Users.prototype.findAll = function () {
    var _this = this;

    return Db.then(function (db) {

        return db.collection(_this.name)
            .find()
            .toArrayAsync();
    });
};

Users.prototype.findByIdAndToken = function (secret, token) {
    var _this = this;
        query = {
            '_id': new ObjectID(secret),
            'token': token
        };

    return Db.then(function (db) {

        return db.collection(_this.name)
            .findOneAsync(query);
    });
};

Users.prototype.getToken = function () {

    return crypto
        .randomBytes(32)
        .toString('hex');
};

module.exports = Users;
