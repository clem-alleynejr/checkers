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

// hard coded, as the board will always be 8x8:
const firstColNum = 0 
const lastColNum = 7
const topRowNum = 0
const botRowNum = 7

/*----- state variables -----*/
let board;
let turn; // 1 for Black, -1 for Red
let blackScore; // starts at 12. if this reaches 0, red wins
let redScore; // starts at 12. if this reaches 0, black wins
let playerPieces; 
let selectedPiece; // object containing properties of selected piece
let winner;
let afterMove; // true if there is an available move player can take after making previous move
let blackGraveyard; 
let redGraveyard;
// let selectedPiece;

/*----- cached elements  -----*/
const squareEls = document.querySelectorAll('#board > div')
let blackPieceEls = document.querySelectorAll('span[class^="black"]')
let redPieceEls = document.querySelectorAll('span[class^="red-piece"]')
const messageEl = document.querySelector('main h1')
const playAgainBtnEl = document.getElementById('play-again')
const endTurnBtnEl = document.getElementById('end-turn') 

/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', handleClick);
document.getElementById('play-again').addEventListener('click', init);
document.getElementById('end-turn').addEventListener('click', nextTurn);


/*----- functions -----*/
init();

function addEventListenersOnPieces() {
    if (turn === 1) {
        blackPieceEls.forEach(blackPiece => blackPiece.addEventListener('click', getPlayerPieces))
    } else {
        redPieceEls.forEach(redPiece => redPiece.addEventListener('click', getPlayerPieces))
    }
}

function getPlayerPieces() {
    if (turn === 1) {
        playerPieces = redPieceEls;
    } else {
        playerPieces = blackPieceEls;
    }
    removeAllOnclicks();
    removeSelectionBorders();
}

function removeAllOnclicks() { // Note: Onclick attribute will be used on the squares instead of addEventListener, as these will need to stay dynamic 
    squareEls.forEach(square => square.removeAttribute('onclick'));
}

function removeSelectionBorders() {
    playerPieces.forEach(piece => piece.style.border = '')
    resetSelectedPieceProperties();
    getSelectedPiece();
}

function resetSelectedPieceProperties() {
        selectedPiece.pieceId = -1;
        selectedPiece.king = false;
        selectedPiece.mvDiagUpLeft = false;
        selectedPiece.mvDiagUpRight = false;
        selectedPiece.jumpDiagUpLeft = false;
        selectedPiece.jumpDiagUpRight = false;
        selectedPiece.mvDiagDownLeft = false;
        selectedPiece.mvDiagDownRight = false;
        selectedPiece.jumpDiagDownLeft = false;
        selectedPiece.jumpDiagDownRight = false;
}

function getSelectedPiece() {
    selectedPiece.pieceId = parseInt(evt.target.id);
    selectedPiece.pieceRow = board.findIndex((row) => row.includes(selectedPiece.pieceId) === true);
    selectedPiece.pieceCol = board[selectedPiece.pieceRow].findIndex((col) => col === selectedPiece.pieceId);
}

function isPieceKing() {
    if (document.getElementById(selectedPiece.pieceId).classList.contains("king")) {
        selectedPiece.king = true;
    } else {
        selectedPiece.king = false;
    }
    getAvailMoves();
}

function getAvailMoves() {
    up = selectedPiece.pieceRow - 1;
    down = selectedPiece.pieceRow + 1;
    left = selectedPiece.pieceCol - 1;
    right = selectedPiece.pieceCol + 1;   
    twoUp = selectedPiece.pieceRow - 2;
    twoDown = selectedPiece.pieceRow + 2;
    twoLeft = selectedPiece.pieceCol - 2;
    twoRight = selectedPiece.pieceCol + 2;
    getAvailDiagMoves();
    getAvailJumpMoves();
    if (selectedPiece.mvDiagUpLeft || selectedPiece.mvDiagUpRight || selectedPiece.jumpDiagUpLeft || selectedPiece.jumpDiagUpRight || selectedPiece.mvDiagDownLeft 
        || selectedPiece.mvDiagDownRight || selectedPiece.jumpDiagDownLeft || selectedPiece.jumpDiagDownRight) {
            document.getElementById(selectedPiece.pieceId).style.border = '0.25vmin solid blue';
    } else return; 
}

function getAvailDiagMoves() {
    if (selectedPiece.king) {
        if (board[up][left] === null
            && left >= firstColNumn
            && up <= topRowNum) {
                selectedPiece.mvDiagUpLeft = true; 
        }
        if (board[up][right] === null
            && right <= lastColNum
            && up <= topRowNum) {
                selectedPiece.mvDiagUpRight = true;
        }
        if (board[down][left] === null
            && left >= firstColNum
            && down >= botRowNum) {
                selectedPiece.mvDiagDownLeft = true;
        }
        if (board[down][right] === null
            && right <= lastColNum
            && down >= botRowNum) {
                selectedPiece.mvDiagDownRight = true;
        }
    } else {
        if (turn === 1) {
            if (board[up][right] === null
                && right <= lastColNum
                && up <= topRowNum) {
                    selectedPiece.mvDiagUpRight = true;
            }
            if (board[up][right] === null
                && right <= lastColNum
                && up <= topRowNum) {
                    selectedPiece.mvDiagUpRight = true;
            }            
            selectedPiece.mvDiagDownLeft = false;
            selectedPiece.mvDiagDownRight = false;
        } else {
            selectedPiece.mvDiagUpLeft = false;
            selectedPiece.mvDiagUpRight = true;
            if (board[down][left] === null
                && left >= firstColNum
                && down >= botRowNum) {
                    selectedPiece.mvDiagDownLeft = true;
            }
            if (board[down][right] === null
                && right <= lastColNum
                && down >= botRowNum) {
                    selectedPiece.mvDiagDownRight = true;
            }
        }
    }
};


function getAvailJumpMoves() {
    if (turn === 1) // Black perspective
        if (board[twoUp][twoLeft] === null 
            && board[up][left] <= 11 // pieces 0-11 belong to Red
            && twoUp <= topRowNum
            && twoLeft >= firstColNum) {
                selectedPiece.jumpDiagUpLeft = true;
        }
        if (board[twoUp][twoRight] === null
            && board[up][right] <= 11
            && twoUp <= topRowNum
            && twoRight <= lastColNum) {
                selectedPiece.jumpDiagUpRight = true;
        }
        if (board[twoDown][twoLeft] === null
            && board[down][left] <= 11
            && twoDown >= botRowNum
            && twoLeft >= firstColNum) {
                selectedPiece.jumpDiagDownLeft = true;
        }
        if (board[twoDown][twoRight] === null
            && board[down][right] <= 11
            && twoDown >= botRowNum
            && twoRight <= lastColNum) {
                selectedPiece.jumpDiagDownRight = true;
        }
    if (turn === -1) // Red perspective
        if (board[twoUp][twoLeft] === null 
            && board[up][left] >= 12 // pieces 12-23 belong to Black
            && twoUp <= topRowNum
            && twoLeft >= firstColNum) {
                selectedPiece.jumpDiagUpLeft = true;
        }
        if (board[twoUp][twoRight] === null
            && board[up][right] >= 12
            && twoUp <= topRowNum
            && twoRight <= lastColNum) {
                selectedPiece.jumpDiagUpRight = true;
        }
        if (board[twoDown][twoLeft] === null
            && board[down][left] >= 12
            && twoDown >= botRowNum
            && twoLeft >= firstColNum) {
                selectedPiece.jumpDiagDownLeft = true;
        }
        if (board[twoDown][twoRight] === null
            && board[down][right] >= 12
            && twoDown >= botRowNum
            && twoRight <= lastColNum) {
                selectedPiece.jumpDiagDownRight = true;
        }
};

function createDestinationClicks() {
    if (mvDiagUpLeft) {
        document.getElementById(`r${up}c${left}`).setAttribute('onclick', 'movePiece(-1, -1)');
    }
    if (mvDiagUpRight) {
        document.getElementById(`r${up}c${right}`).setAttribute('onclick', 'movePiece(-1, 1)');
    }
    if (jumpDiagUpLeft) {
        document.getElementById(`r${twoUp}c${twoLeft}`).setAttribute('onclick', 'movePiece(-2, -2)');
    }
    if (jumpDiagUpRight) {
        document.getElementById(`r${twoUp}c${twoRight}`).setAttribute('onclick', 'movePiece(-2, 2)');
    }
    if (mvDiagDownLeft) {
        document.getElementById(`r${down}c${left}`).setAttribute('onclick', 'movePiece(1, -1)');
    }
    if (mvDiagDownRight) {
        document.getElementById(`r${down}c${right}`).setAttribute('onclick', 'movePiece(1, 1)');
    }
    if (jumpDiagDownLeft) {
        document.getElementById(`r${twoDown}c${twoLeft}`).setAttribute('onclick', 'movePiece(2, -2)');
    }
    if (jumpDiagDownRight) {
        document.getElementById(`r${twoDown}c${twoRight}`).setAttribute('onclick', 'movePiece(2, 2)');
    }
}

function movePiece(rowOffset, colOffset) {
    vertMove = selectedPiece.pieceRow + rowOffset;
    horizMove = selectedPiece.pieceCol + colOffset;
    document.getElementById(selectedPiece.pieceId).remove();
    document.getElementById(`r${vertMove}c${horizMove}`).innerHTML = '';
    if (turn === 1) {
        document.getElementById(`r${rowOffset}c${colOffset}`).innerHTML = `<span class="black-piece king" id="${selectedPiece.pieceId}"></p>`;
        blackPieceEls = document.querySelectorAll('span[class^="black"]')
    }
}



































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
        [ null, 0, null, 1, null, 2, null, 3],
        [ 4, null, 5, null, 6, null, 7, null], 
        [ null, 8, null, 9, null, 10, null, 11], 
        [null, null, null, null, null, null, null, null], 
        [null, null, null, null, null, null, null, null], 
        [ 12, null, 13, null, 14, null, 15, null], 
        [ null, 16, null, 17, null, 18, null, 19], 
        [ 20, null, 21, null, 22, null, 23, null], 
        ];
    turn = 1; // Black Starts
    blackScore = 12;
    redScore = 12;
    selectedPiece = {
        pieceId: -1,
        pieceRow: -1,
        pieceCol: -1,
        king: false,
        mvDiagUpLeft: false,
        mvDiagUpRight: false,
        jumpDiagUpLeft: false,
        jumpDiagUpRight: false,
        mvDiagDownLeft: false,
        mvDiagDownRight: false,
        jumpDiagDownLeft: false,
        jumpDiagDownRight: false,
    }
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