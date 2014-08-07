// Setting a bit
// Use the bitwise OR operator (|) to set a bit.

// number |= 1 << x;
// That will set bit x.

// Clearing a bit
// Use the bitwise AND operator (&) to clear a bit.

// number &= ~(1 << x);
// That will clear bit x. You must invert the bit string with the bitwise NOT operator (~), then AND it.

// Toggling a bit
// The XOR operator (^) can be used to toggle a bit.

// number ^= 1 << x;
// That will toggle bit x.

// Checking a bit
// You didn't ask for this but I might as well add it.

// To check a bit, AND it with the bit you want to check:

// bit = number & (1 << x);

function Board (game) {

    // Location for the turn bit
    this.TURN_BIT = 18;

    // Fields offset for the second player
    this.OFFSET = 9;

    // How large the board is
    this.BOARD_LEN = 8;

    // Store the field and both player turns
    this.game = game || 0;
}

/**
 * Check if its user turn or the AI.
 * User = 1
 * AI = 0
 *
 * @method isMyTurn
 * @return {Boolean}
 */
Board.prototype.isMyTurn = function () {

    return !!this.currentTurn();
};

Board.prototype.toggleTurn = function () {

    this.toggle(this.TURN_BIT);
    return this.currentTurn();
};

Board.prototype.setToUserTurn = function() {

    this.set(this.TURN_BIT);
    return this.currentTurn();
};

Board.prototype.setToAITurn = function() {

    this.clear(this.TURN_BIT);
    return this.currentTurn();
};

Board.prototype.setRandomTurn = function() {

    // Get random number to [0, 1], integers
    var random = Math.round(Math.random());

    if (!!random) {
        this.toggleTurn();
    }

    return this.currentTurn();
};

Board.prototype.currentTurn = function() {

    return this.get(this.TURN_BIT);
};

Board.prototype.convertTurn = function (n) {

    if (n >= 0 && n <= this.BOARD_LEN) {

        return n;
    }
    else if (n > this.BOARD_LEN && n <= (this.BOARD_LEN * 2) + 1) {

        return n - this.BOARD_LEN - 1;
    }
    else {

        return new Error('Make sure the turn value range is in 0 - 8, your:' + n);
    }
};

Board.prototype.makeMove = function (n) {
    var offset = 0;

    // n should be value from 0 - 8
    if (n < 0 && n > this.BOARD_LEN) {
        throw Error('Make sure the turn position value is in 0 to 8, current:' + n);
    }

    if (!this.isMyTurn()) {
        offset += this.OFFSET;

        // Look if the spot is free in both sides
        if ((this.get(n - this.OFFSET) | this.get(n)) === 1) {
            throw Error('Seems the spot is already taken, n:' + n);
        }
    }
    else {

        if ((this.get(n + this.OFFSET) | this.get(n)) === 1) {
            throw Error('Seems the spot is already taken, n:' + n);
        }
    }

    this.set(offset + n);

};

Board.prototype.checkWinByTurn = function () {

    var _this = this,
        applyOffset = 0,
        rows = [
            [ 0, 1, 2 ], // Check first row
            [ 3, 4, 5 ],
            [ 6, 7, 8 ],

            [ 0, 3, 6 ], // Column check
            [ 1, 4, 7 ],
            [ 2, 5, 8 ],

            [ 0, 4, 8 ], // Diagonal check
            [ 6, 4, 2 ]
        ];

    if (!this.isMyTurn()) {
        applyOffset = this.OFFSET;
    }

    return rows.some(function (row) {

        if (_this.get(row[0] + applyOffset) &&
            _this.get(row[1] + applyOffset) &&
            _this.get(row[2] + applyOffset)) {

           return true;
        }
    });
};

Board.prototype.checkWin = function() {
    var turn = this.currentTurn();

    if (this.checkWinByTurn()) {

        return turn;
    }

    // Toggle turn bit
    this.toggleTurn();
    turn = this.currentTurn();

    if (this.checkWinByTurn()) {

        this.toggleTurn();
        return turn;
    }

    this.toggleTurn();
    return -1;
};

Board.prototype.freeMoves = function () {
    var offset = 0,
        sign = 1,
        moves = [];


    if (!this.isMyTurn()) {
        sign = -1;
        // Not my turn

        offset += this.OFFSET;
    }

    // Look from my moves
    for (var i = 0 + offset; i <= this.BOARD_LEN + offset; i++) {

        if ((this.get(i + this.OFFSET * sign) | this.get(i)) === 0) {
            moves.push(i);
        }
    }

    return moves;

};

Board.prototype.printLines = function () {
    var offset = 0,
        sign = 1,
        lines = [],
        line = '';


    for (var i = 0,j = 1; i <= this.BOARD_LEN; i++, j++) {

        if (this.get(i) === 1) {

            line += 'X';
        }
        else if (this.get(i + this.OFFSET) === 1) {

            line += 'O';
        }
        else {

            line += '_';
        }


        if (j % 3 === 0) {
            lines.push(line);
            line = '';
            j = 0;
        }
    }

    return lines;
};


Board.prototype.print = function () {
    var lines = this.printLines();

    lines.forEach(function (line) {
        console.log(line);
    });

    return lines;
};



Board.prototype.get = function (n) {
//     return this.game & (1 << n);
    return (this.game >> n) & 1;
};

Board.prototype.set = function (n) {
    this.game |= 1 << n;
};

Board.prototype.toggle = function (n) {
    this.game ^= 1 << n;
};

Board.prototype.clear = function (n) {
    this.game &= ~(1 << n);
};

module.exports = Board;
