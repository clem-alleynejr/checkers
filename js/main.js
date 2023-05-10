//CHECKERS

// Initial Setup:
    
    // Board will be an 8 x 8 grid (64 total squares), with the squares 
    // alternating between gold and white horizontally and vertically.
    // Two players - each on opposite ends of the board. from any of the
    // players' perspective, there should be a white square at the top 
    // left, a gold square at the top right, a gold square at the bottom
    // left, and a white square at the bottom right.
    
    // Each player starts with 12 pieces (checkers) each. Players' pieces are 
    // positioned on opposite ends of the board on the gold squares of 
    // the first three rows of their respective sides.

    // Game will initialize with 'red' starting first.


// Rules:

    // Checkers can only move diagonally on gold squares.
        // NOTE: Checkers can "jump" over opponent checkers diagonally. At 
        // which point, that "jumped" opponent checker will be considered 
        // captured and removed from the board.

    // Checkers can only move towards the opponent (i.e they cannot move
    // backwards)
        // NOTE: Checkers can become "kings" if they reach the last row on 
        // the opposing side, at which point they will gain the ability to
        // move backwards.

    // The goal is the capture all the checkers of the opponent.


// Gameplay:

    // Player chooses one of their checkers too move.
        // If there are no possible moves for the player (i.e opponents checkers
        // block any possible move), the player loses and the game ends.

    // Player chooses square to which chosen checker will move to. (Needs to
    // be a legal move):

        // If this move is a "jump":
            // move player's checker to it's new square,
            // remove the "jumped" opponents checker and into graveyard (side of board),
            // if move gets checker onto last row on the opposing side AND 
            // checker isn't already a king, "king" the checker.
            // if opponent is out of checker's, player wins and game ends.
            // while there are other possible "jumps" to make, prompt player
            // to either:
                // End Turn OR
                // make another possible "jump":
                    // move player's checker to it's new square,
                    // remove the "jumped" opponents checker and into graveyard (side of board),
                    // if move gets checker onto last row on the opposing side AND 
                    // checker isn't already a king, "king" the checker.
                    // if opponent is out of checker's, player wins and game ends.
            // Player's turn ends if:
                // there are no longer any available "jumps" OR
                // Player voluntarily ends their turn

        // If this move is just a single square move diagonally, the player's 
        // turn ends immediately after the move. 
    
    // It will now be the other player's turn.

    // The process repeats until there is a winner.

    


/*----- constants -----*/
const COLORS = {
    '1': {
        piece: '<span class="black-piece"></span>',
        color: 'black'
    },

    '-1': {
        piece: '<span class="red-piece"></span>',
        color: 'red'
    },

    '0': {
        piece: ''
    }
}

/*----- state variables -----*/
let board;
let turn;
let winner;
let afterMove; // true if there is an available move player can take after making previous move
let blackGraveyard; 
let redGraveyard;
let mvDiagUpLeft; let mvDiagUpRight; // true if piece can move up and left/right diagonally
let mvDiagDownLeft; let mvDiagDownRight; // true if piece can move down and left/right diagonally 
// let selectedPiece;

/*----- cached elements  -----*/
const messageEl = document.querySelector('main h1')
const playAgainBtnEl = document.getElementById('play-again')
const endTurnBtnEl = document.getElementById('end-turn') 
const squaresEl = co

/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', handleClick);
document.getElementById('play-again').addEventListener('click', init);
document.getElementById('end-turn').addEventListener('click', nextTurn);


/*----- functions -----*/
init();








function handleClick(evt) {
    let onSquareRow = parseInt(evt.target.parentElement.id.substr(1,1));
    let onSquareCol = parseInt(evt.target.parentElement.id.substr(3,3));
    //Guard
    if (board[onSquareRow][onSquareCol] !== turn) return;
    // Otherwise...
    console.log(evt.t)
    console.log(board[onSquareRow][onSquareCol])
    getAvailDiagMoves(onSquareRow, onSquareCol);
    

    
    
};

function getAvailDiagMoves(onSquareRow, onSquareCol) {
    const onSquare = board[onSquareRow][onSquareCol];
    mvDiagUpLeft = (onSquareCol - 1 >= 0 && board[onSquareRow - 1][onSquareCol - 1] === 0) ? true : false;
    mvDiagUpRight = (onSquareCol + 1 <= board[0].length - 1 && board[onSquareRow - 1][onSquareCol + 1] === 0) ? true : false;
    console.log(mvDiagUpLeft, mvDiagUpRight) 
};



function getAvailMoves(evt) {
    
}


function getAvailJumpMoves(evt) { 

};

function countAdjacent(rowIdx, colIdx, colOffset, rowOffset) {

};

function nextTurn(evt) {
    turn *= -1;
};

function init() {
    board = [
    // col 0   1   2   3   4   5   6   7      
        [  0, -1,  0, -1,  0, -1,  0, -1], // row 0
        [ -1,  0, -1,  0, -1,  0, -1,  0], // row 1
        [  0, -1,  0, -1,  0, -1,  0, -1], // row 2
        [  0,  0,  0,  0,  0,  0,  0,  0], // row 3
        [  0,  0,  0,  0,  0,  0,  0,  0], // row 4
        [  1,  0,  1,  0,  1,  0,  1,  0], // row 5
        [  0,  1,  0,  1,  0,  1,  0,  1], // row 6
        [  1,  0,  1,  0,  1,  0,  1,  0], // row 7
        ];
    turn = 1;
    winner = null;
    afterMove = null;
    blackGraveyard = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ]
    redGraveyard = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ]
    // selectedPiece = board[7][0]
    render();
};

function render() {
    renderBoard();
    renderMessage();
    renderControls();
};

function renderBoard() {
    board.forEach(function(rowArr, rowIdx) {
        rowArr.forEach(function(cellVal, colIdx) {
            const squareEl = document.getElementById(`r${rowIdx}c${colIdx}`);
            squareEl.innerHTML = COLORS[cellVal].piece;         
        });
    });
};

function renderMessage() {
    if (winner === 'T') {
        messageEl.innerHTML = '<span style="color: #EBB64A">It\'s a Tie!!!</span>';
    } else if (winner) {
        messageEl.innerHTML = `<span style="color: ${COLORS[winner].color}">${COLORS[winner].color} Wins!</span>`;
    } else {
        messageEl.innerHTML = `<span style="color: ${COLORS[turn].color}">${COLORS[turn].color}'s Turn</span>`;
    }
};

function renderControls() {
    playAgainBtnEl.style.visibility = winner ? 'visible' : 'hidden';
    endTurnBtnEl.style.visibility = afterMove ? 'visible' : 'hidden';
};


























































// function handleClick(evt) {
//     // Guards:
//     if (evt.target.className !== "black-piece" && evt.target.className !== "red-piece") return; // Need to click on checker piece
//     if (turn === 1 && evt.target.className !== "black-piece") return; // Black player cant pick a red piece
//     if (turn === -1 && evt.target.className !== "red-piece") return; // Red player can't pick a black piece
//     // Otherwise...
//     getAvailDiagMoves(evt);
//     console.log(evt.target.parentElement.id.substr(1,1));
//     console.log(onSquareRow);
// };

// function getAvailDiagMoves(evt) {
//     const onSquareRow = evt.target.parentElement.id.substr(1,1);
//     const onSquareCol = evt.target.parentElement.id.substr(3,3);
//     const onSquare = board[onSquareRow][onSquareCol];
//     // if black:
//     if (evt.target.className === "black-piece") {
//         mvDiagUpLeft = board[onSquareRow - 1][onSquareCol - 1] === 0 ? true : false; // black can move up diagonal left if true
//         mvDiagUpRight = board[onSquareRow - 1][onSquareCol + 1] === 0 ? true : false; // black can move up diagonal right if true
//     };
//     // if red:
//     if (evt.target.className === "red-piece") {
//         mvDiagDownLeft = countAdjacent(onSquareRow, onSquareCol, 1, -1) === 0 ? true : false; // red can move down diagonal left if true
//         mvDiagDownRight = countAdjacent(onSquareRow, onSquareCol, 1, 1) === 0 ? true : false; // red can move down diagonal right if true
//     };
// };








// function handleClick(evt) {
//     // let blackPiecesEl = [...document.querySelectorAll('.black-piece')]
//     // let redPiecesEl = [...document.querySelectorAll('.red-piece')]
//     let row = parseInt(evt.target.parentElement.id.substr(1,1));
//     let col = parseInt(evt.target.parentElement.id.substr(3,3));
//     if (board[row][col] !== turn) return;
//     if (selectedPiece) {
//         getAvailDiagMoves(row, col);
//     }
    

//     // Otherwise...
    
//     console.log(mvDiagDownLeft);
// };

// function getAvailDiagMoves(row, col) {
// console.log(row - 1, col + 1)
//     const onSquare = board[row][col];
//     // if black:
//     if (turn === 1) {
//         if (row - 1 >= 0) {
//             mvDiagUpLeft = (col - 1 >= 0 && board[row - 1][col - 1] === 0) ? true : false;
//             mvDiagUpRight = (col + 1 <= board[0].length - 1 && board[row - 1][col + 1] === 0) ? true : false;
//         }
//     };
//     console.log(mvDiagUpLeft, mvDiagUpRight) ;
//     // if red:
//     // if (turn === -1 && redPieceNumber !== -1) {
//     //     mvDiagDownLeft = countAdjacent(onSquareRow, onSquareCol, 1, -1) === 0 ? true : false; // red can move down diagonal left if true
//     //     mvDiagDownRight = countAdjacent(onSquareRow, onSquareCol, 1, 1) === 0 ? true : false; // red can move down diagonal right if true
//     // };
// };