var path   = require('path'),
    assert = require('assert'),
    lib    = path.join(__dirname + './../lib'),
    AI     = require(path.join(lib, 'naive-ai')),
    Board  = require(path.join(lib, 'board'));

describe('Board', function() {

    beforeEach(function (done) {

        this.board = new Board();
        this.ai    = new AI(this.board);

        done();
    });

    it('should check naive search', function (done) {
        var turn = this.board.setToAITurn(),
            aiTurn;

        // Game
        // X__
        // _X_
        // ___

        // AI starts
        this.board.makeMove(0);
        this.board.makeMove(4);

        this.ai = new AI(this.board);

        assert.equal(this.ai.search(), 8);
        assert.equal(false, true);
        done();
    });
});
