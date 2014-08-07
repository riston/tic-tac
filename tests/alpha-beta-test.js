var path   = require('path'),
    assert = require('assert'),
    lib    = path.join(__dirname + './../lib'),
    AB     = require(path.join(lib, 'alpha-beta-ai')),
    Board  = require(path.join(lib, 'board'));

describe('Board', function() {

    beforeEach(function (done) {

        this.board = new Board();
        this.ab    = new AB(this.board);

        done();
    });

    it.skip('should check alpha beta', function (done) {
        var turn = this.board.setToAITurn();

        // AI starts
        this.board.makeMove(0);
        this.board.makeMove(4);
        // this.board.makeMove(6);

        // this.board.toggleTurn();

        try {
            console.log(
                this.ab.search(this.board.game, -Infinity, Infinity, true, 0)
            );

        }
        catch (e) {
            console.log('Error', e);
        }
        this.board.print();
        // assert.equal(this.board.checkWin(), true);

        done();
    });
});
