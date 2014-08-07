
function NaiveAI (board) {

    this.board = board;

    this.CENTER_TILE = 13;
}

NaiveAI.prototype.search = function() {
    var moves = [],
        win,
        turn;

    if (this.board.currentTurn() !== 0) {

        throw new Error('Seems it\'s not the computer turn');
    }

    // Find free moves
    moves = this.board.freeMoves();

    for (var i = 0; i < moves.length; i++) {

        this.board.makeMove(
            this.board.convertTurn(moves[i])
        );

        win = this.board.checkWin();

        if (win === 0 || win === 1) {

            turn = moves[i];

            this.board.clear(moves[i]);

            break;
        }

        this.board.clear(moves[i]);
    }

    if (!turn && moves.indexOf(this.CENTER_TILE) !== -1) {

        turn = this.CENTER_TILE;
    }

    // No winning move choose random
    if (!turn) {

        turn = moves[~~(Math.random() * moves.length)];
    }

    return this.board.convertTurn(turn);
};

module.exports = NaiveAI;
