var path   = require('path'),
    assert = require('assert'),
    lib    = path.join(__dirname + './../lib'),
    Board  = require(path.join(lib, 'board'));

describe('Board', function() {

    beforeEach(function (done) {

        this.board = new Board();
        done();
    });

    it('should create empty board', function (done) {
        assert.equal(this.board.game, 0);

        done();
    });

    it('should test the game win check flow', function (done) {

        // XXX
        // ___
        // OO_

        var turn = this.board.setToUserTurn();
        // User starts
        this.board.makeMove(0);
        this.board.toggleTurn();

        // AI
        this.board.makeMove(6);
        this.board.toggleTurn();

        // User
        this.board.makeMove(1);
        this.board.toggleTurn();

        // AI
        this.board.makeMove(7);
        this.board.toggleTurn();

        // User
        this.board.makeMove(2);

        // this.board.print();
        assert.equal(this.board.get(0), 1);
        assert.equal(this.board.checkWin(), 1);

        done();
    });

    it('should do the diagonal check', function (done) {
        var turn = this.board.setToAITurn();

        //X__
        //_X_
        //__X

        // AI starts
        this.board.makeMove(0);
        this.board.makeMove(4);
        this.board.makeMove(8);

        assert.equal(this.board.checkWin(), 0);
        // this.board.print();
        done();
    });

    it('should check there is no win in this board', function (done) {
        var turn = this.board.setToAITurn();

        //XX_
        //_O_
        //__X

        // AI starts
        this.board.makeMove(0);
        this.board.makeMove(1);
        this.board.makeMove(8);

        this.board.setToUserTurn();
        this.board.makeMove(4);

        assert.equal(this.board.checkWin(), -1);

        done();
    });

    it('should simulate real game logic', function (done) {
        // OOO
        // XX_
        // ___

        // Get random player's turn
        var turn = this.board.setRandomTurn();

        this.board.makeMove(0);
        this.board.toggleTurn();

        this.board.makeMove(3);
        this.board.toggleTurn();

        this.board.makeMove(1);
        this.board.toggleTurn();

        this.board.makeMove(4);
        this.board.toggleTurn();

        this.board.makeMove(2);
        // this.board.toggleTurn();


        assert(this.board.checkWin() !== -1);
        assert.equal(this.board.checkWin(), this.board.currentTurn());
        done();
    })
});
