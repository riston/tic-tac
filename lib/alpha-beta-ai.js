// TODO: currently not workin as supposed, needs fixing and tests

function AlphaBetaAI (board) {
    this.board = board;

    this.maximiser = this.board.currentTurn();

    this.parent = {
        val: -1,
        parent: null,
        next: null,
        score: 0,
    };

}

AlphaBetaAI.prototype.search = function (game, alpha, beta, maximizing, depth) {
    var moves = [],
        win,
        node,
        score;

    this.board.game = game;

    win = this.board.checkWin();
    if (win !== -1) {
        console.log("Winning board", win);
        this.board.print();

        console.log(require('util').inspect(this.parent, { showHidden: true, depth: null }));

        return maximizing ?
            Infinity : -Infinity;
    }

    moves = this.board.freeMoves();
    console.log("current turn", this.board.currentTurn(), moves, " depth ", depth);

    for (var i = 0; i < moves.length; i++) {

        // Maximizer
        if (maximizing) {

            console.log('max', this.board.convertTurn(moves[i]));

            this.board.makeMove(
                this.board.convertTurn(moves[i])
            );

            this.board.print();
            this.board.toggleTurn();

            node = {
                val: moves[i],
                parent: this.parent,
                next: null
            };

            this.parent.next = node;


            // this.board.toggleTurn();

            alpha = Math.max(alpha,
                this.search (this.board.game, alpha, beta, false, depth++));

            this.board.clear(moves[i]);
            console.log('Alpha', alpha);

            if (beta <= alpha) {
                console.log('Cut alpha');
                return alpha;
            }

            return alpha;
        }
        // Minimizer
        else {

            console.log('min', this.board.convertTurn(moves[i]));

            this.board.makeMove(
                this.board.convertTurn(moves[i])
            );
            this.board.print();
            this.board.toggleTurn();

            node = {
                val: moves[i],
                parent: this.parent,
                next: null
            };

            this.parent.next = node;

            beta = Math.min(beta,
                this.search (this.board.game, alpha, beta, true, depth++));

            this.board.clear(moves[i]);

            console.log('Beta ', beta);

            if (beta <= alpha) {
                console.log('Cut beta');
                return beta;
            }

            return beta;
        }
    }

};

module.exports = AlphaBetaAI;
