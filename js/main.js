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
    '1': 'black',
    '-1': 'red'
}

/*----- state variables -----*/
let board;
let turn;
let winner;
let blackGraveyard; 
let redGraveyard;

/*----- cached elements  -----*/
const squareEls = [...document.querySelectorAll('#board > div')];

/*----- event listeners -----*/


/*----- functions -----*/
init();


function init() {

    
    // board = [
    // // col a   b   c   d   e   f   g   h  
    //     [  0, -1,  0, -1,  0, -1,  0, -1], // row 8
    //     [ -1,  0, -1,  0, -1,  0, -1,  0], // row 7
    //     [  0, -1,  0, -1,  0, -1,  0, -1], // row 6
    //     [  0,  0,  0,  0,  0,  0,  0,  0], // row 5
    //     [  0,  0,  0,  0,  0,  0,  0,  0], // row 4
    //     [  1,  0,  1,  0,  1,  0,  1,  0], // row 3
    //     [  0,  1,  0,  1,  0,  1,  0,  1], // row 2
    //     [  1,  0,  1,  0,  1,  0,  1,  0], // row 1
    //     ];
    turn = 1;
    winner = null;
    render();
};

function render() {
    renderBoard()
};


// need to map div#a8 to board[0][0]
//  ''  ''  '' div#b8 === board[0][1]
//  ''  ''  '' div#c8 === board[0][3]

function renderBoard() {
    board.forEach(function(rowArr, rowIdx) {
        rowArr.forEach(function(cellVal, colIdx) {
            if (cellVal === 1) {squareEls.innerHTML = '<span id="black-piece"></span>'}
            else if (cellVal === -1) {squareEls.innerHTML = '<span id="black-piece"></span>'}
            else if (cellVal === 0) {squareEls.innerHTML = ''}
        });
    });
};

