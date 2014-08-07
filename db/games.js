var crypto = require('crypto'),
    ObjectID = require('mongodb').ObjectID,
    Board = require('../lib/board'),
    NaiveAI = require('../lib/naive-ai'),
    Db = require('./init');

function Games () {

    this.name = 'games';
}

Games.prototype.new = function (userData) {
    var _this = this,
        board = new Board(),
        ai,
        turn,
        data;

    turn = board.setRandomTurn();

    // AI turn
    if (turn === 0) {
        ai = new NaiveAI(board);
        board.makeMove(ai.search());
        board.toggleTurn();
    }

    data = {
        'turns': [ board.game ],
        'status': turn,
        'player': userData.id,
        'created': new Date(),
        'modified': new Date(),
    };

    return Db.then(function (db) {

        return db.collection(_this.name)
            .insertAsync(data);
    });
};

Games.prototype.move = function (userData) {
    var _this = this;

    return _this.find(userData.gid)
        .then(function (game) {
            var board,
                win,
                moves,
                turn,
                ai;

            if (!game || (game && game === null)) {
                console.log('No game');
                throw new Error('There is no game instance found!');
            }

            // Take out the last board
            var lastBoard = game.turns[game.turns.length - 1];

            board = new Board(lastBoard);
            turn = board.currentTurn();

            win = board.checkWin();
            if (win !== -1) {

                throw new Error('Create a new game, this is already over!');
            }

            // User turn
            if (turn === 1) {
                board.makeMove(userData.move);

                // Change current turn
                board.setToAITurn();
                game.turns.push(board.game);
                game.status = 0;
                turn = 0;
            }

            // Check if someone has already won
            win = board.checkWin();
            if (win !== -1) {

                game.status = 'winner-user';
                return game;
            }

            // AI turn
            if (turn === 0) {
                ai = new NaiveAI(board);
                board.makeMove(ai.search());

                // Change turn
                board.setToUserTurn();
                game.turns.push(board.game);
                game.status = 1;
                turn = 1;
            }

            // Check if someone has already won
            win = board.checkWin();
            if (win !== -1) {

                game.status = 'winner-ai';
                return game;
            }

            // Find if there is any free move left
            moves = board.freeMoves();
            board.toggleTurn();
            moves.concat(board.freeMoves());
            board.toggleTurn();

            // Other cases like if the game is over
            if (moves.length <= 0) {

                game.status = 'draw';
                return game;
            }

            board.print();
            return game;
        })
        .then(function (game) {

            game.modified = new Date();
            return _this.update(game);
        });
};

Games.prototype.printGameObject = function (game) {
    var boards = [],
        newBoard;

    if (game && game.turns) {

        game.turns.forEach(function (board) {
            newBoard = new Board(board);
            boards.push(newBoard.printLines());
        });

        game.boards = boards;
    }

    return game;
};

Games.prototype.update = function (game) {
    var _this = this;

    return Db.then(function (db) {

        return db.collection(_this.name)
            .findAndModifyAsync({
                _id: new ObjectID(game._id)
            }, [], game, { new: true });
    });
};

Games.prototype.find = function (id) {
    var _this = this;

    return Db.then(function (db) {

        return db.collection(_this.name)
            .findOneAsync({
                _id: new ObjectID(id)
            });
    });
};

Games.prototype.findAll = function () {
    var _this = this;

    return Db.then(function (db) {

        return db.collection(_this.name)
            .find()
            .toArrayAsync();
    });
};

Games.prototype.getWinnerCount = function () {
    var _this = this;

    return Db.then(function (db) {

        return db.collection(_this.name)
            .find()
            .toArrayAsync();
    });
};

Games.prototype.getTotal = function (type) {
    var _this = this,
        queries = {},
        query = [];

    queries = {
        'user-turns': { status: 1 },
        'ai-turns': { status: 0 },
        'draws': { status: 'draw' },
        'total-wins': {
            $or: [
                { status: "winner-ai" },
                { status: "winner-user" }
            ]
        }
    };

    if (!queries[type]) {
        throw Error('Unkown type specified in stats \'' + type + '\'');
    }

    return Db.then(function (db) {

        return db.collection(_this.name)
            .aggregateAsync([
                { $match: queries[type] },
                { $group: { _id: null, count: { $sum: 1 } } }
            ]);
    });
};

Games.prototype.stats = function () {
    var _this = this;

    return this.getTotal('user-turns');
};

module.exports = Games;
