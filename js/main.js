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
            color: 'black'
        },
        '-1': {
            color: 'red'
        }
    }

    // hard coded, as the board will always be 8x8:
    const firstColNum = 0; 
    const lastColNum = 7;
    const topRowNum = 0;
    const botRowNum = 7;

/*----- state variables -----*/
let board;
let turn; // 1 for Black, -1 for Red
let blackScore; // starts at 12. if this reaches 0, red wins
let redScore; // starts at 12. if this reaches 0, black wins
let playerPieces; 
let selectedPiece; // object containing properties of selected piece
let winner;
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


/*----- functions -----*/
init();

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
    render();
};

function render() {
    renderMessage();
    renderControls();
};

function renderMessage() {
    if (winner) {
        messageEl.innerHTML = `<span style="color: ${COLORS[winner].color}">${COLORS[winner].color} Wins!</span>`;
    } else {
        messageEl.innerHTML = `<span style="color: ${COLORS[turn].color}">${COLORS[turn].color}'s Turn</span>`;
    }
};

function renderControls() {
    playAgainBtnEl.style.visibility = winner ? 'visible' : 'hidden';
};



function getPlayerPieces(evt) {
    if (turn === 1) {
        playerPieces = blackPieceEls;
    } else {
        playerPieces = redPieceEls;
    }
    removeSquareOnclicks();
    removeSelectionBorders(evt);
}

function removeSquareOnclicks() { // Note: Onclick attribute will be used on the squares instead of addEventListener, as these will need to stay dynamic 
    squareEls.forEach(square => square.removeAttribute('onclick'));
}

function removeSelectionBorders(evt) {
    playerPieces.forEach(piece => piece.style.border = '')
    resetSelectedPieceProperties();
    getSelectedPiece(evt);
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

function getSelectedPiece(evt) {
    selectedPiece.pieceId = parseInt(evt.target.id);
    selectedPiece.pieceRow = board.findIndex((row) => row.includes(selectedPiece.pieceId) === true);
    selectedPiece.pieceCol = board[selectedPiece.pieceRow].findIndex((col) => col === selectedPiece.pieceId);
    isPieceKing();
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
    console.log();
    if (selectedPiece.mvDiagUpLeft || selectedPiece.mvDiagUpRight || selectedPiece.jumpDiagUpLeft || selectedPiece.jumpDiagUpRight || selectedPiece.mvDiagDownLeft 
        || selectedPiece.mvDiagDownRight || selectedPiece.jumpDiagDownLeft || selectedPiece.jumpDiagDownRight) {
            document.getElementById(selectedPiece.pieceId).style.border = '0.25vmin solid blue';
            createDestinationClicks()
    } else return; 
}

function getAvailDiagMoves() {
    if (selectedPiece.king) {
        if (board[up][left] === null
            && left >= firstColNum
            && up >= topRowNum) {
                selectedPiece.mvDiagUpLeft = true; 
        }
        if (board[up][right] === null
            && right <= lastColNum
            && up >= topRowNum) {
                selectedPiece.mvDiagUpRight = true;
        }
        if (board[down][left] === null
            && left >= firstColNum
            && down <= botRowNum) {
                selectedPiece.mvDiagDownLeft = true;
        }
        if (board[down][right] === null
            && right <= lastColNum
            && down <= botRowNum) {
                selectedPiece.mvDiagDownRight = true;
        }
    } else {
        if (turn === 1) {
            if (board[up][left] === null
                && left >= firstColNum
                && up >= topRowNum) {
                    selectedPiece.mvDiagUpLeft = true;
            }
            if (board[up][right] === null
                && right <= lastColNum
                && up >= topRowNum) {
                    selectedPiece.mvDiagUpRight = true;
            }            
            selectedPiece.mvDiagDownLeft = false;
            selectedPiece.mvDiagDownRight = false;
        } else {
            selectedPiece.mvDiagUpLeft = false;
            selectedPiece.mvDiagUpRight = true;
            if (board[down][left] === null
                && left >= firstColNum
                && down <= botRowNum) {
                    selectedPiece.mvDiagDownLeft = true;
            }
            if (board[down][right] === null
                && right <= lastColNum
                && down <= botRowNum) {
                    selectedPiece.mvDiagDownRight = true;
            }
        }
    }
};

function getAvailJumpMoves() {
    if (turn === 1) { // Black perspective
        if (twoUp >= topRowNum
            && twoLeft >= firstColNum
            && board[twoUp][twoLeft] === null
            && board[up][left] !== null 
            && board[up][left] <= 11) { // pieces 0-11 belong to Red (can jump over them)
                selectedPiece.jumpDiagUpLeft = true;
        }
        if (twoUp >= topRowNum
            && twoRight <= lastColNum
            && board[twoUp][twoRight] === null
            && board[up][right] !== null 
            && board[up][right] <= 11) {
                selectedPiece.jumpDiagUpRight = true;
        }
        if (twoDown <= botRowNum
            && twoLeft >= firstColNum
            && board[twoDown][twoLeft] === null
            && board[down][left] !== null 
            && board[down][left] <= 11) {
                selectedPiece.jumpDiagDownLeft = true;
        }
        if (twoDown <= botRowNum
            && twoRight <= lastColNum
            && board[twoDown][twoRight] === null
            && board[down][right] !== null 
            && board[down][right] <= 11) {
                selectedPiece.jumpDiagDownRight = true;
        }
    } else {// Red perspective
        if (twoUp >= topRowNum
            && twoLeft >= firstColNum
            && board[twoUp][twoLeft] === null 
            && board[up][left] !== null 
            && board[up][left] >= 12) { // pieces 12-23 belong to Black (can jump over them)
                selectedPiece.jumpDiagUpLeft = true;
        }
        if (twoUp >= topRowNum
            && twoRight <= lastColNum
            && board[twoUp][twoRight] === null
            && board[up][right] !== null 
            && board[up][right] >= 12) {
                selectedPiece.jumpDiagUpRight = true;
        }
        if (twoDown <= botRowNum
            && twoLeft >= firstColNum
            && board[twoDown][twoLeft] === null
            && board[down][left] !== null 
            && board[down][left] >= 12) {
                selectedPiece.jumpDiagDownLeft = true;
        }
        if (twoDown <= botRowNum
            && twoRight <= lastColNum
            && board[twoDown][twoRight] === null
            && board[down][right] !== null 
            && board[down][right] >= 12) {
                selectedPiece.jumpDiagDownRight = true;
        }
    }
};

function createDestinationClicks() { // onclick attributes used instead of addEvent listener, as these need to be dynamic
    if (selectedPiece.mvDiagUpLeft) {
        document.getElementById(`r${up}c${left}`).setAttribute('onclick', 'movePiece(-1, -1)');
    }
    if (selectedPiece.mvDiagUpRight) {
        document.getElementById(`r${up}c${right}`).setAttribute('onclick', 'movePiece(-1, 1)');
    }
    if (selectedPiece.jumpDiagUpLeft) {
        document.getElementById(`r${twoUp}c${twoLeft}`).setAttribute('onclick', 'movePiece(-2, -2)');
    }
    if (selectedPiece.jumpDiagUpRight) {
        document.getElementById(`r${twoUp}c${twoRight}`).setAttribute('onclick', 'movePiece(-2, 2)');
    }
    if (selectedPiece.mvDiagDownLeft) {
        document.getElementById(`r${down}c${left}`).setAttribute('onclick', 'movePiece(1, -1)');
    }
    if (selectedPiece.mvDiagDownRight) {
        document.getElementById(`r${down}c${right}`).setAttribute('onclick', 'movePiece(1, 1)');
    }
    if (selectedPiece.jumpDiagDownLeft) {
        document.getElementById(`r${twoDown}c${twoLeft}`).setAttribute('onclick', 'movePiece(2, -2)');
    }
    if (selectedPiece.jumpDiagDownRight) {
        document.getElementById(`r${twoDown}c${twoRight}`).setAttribute('onclick', 'movePiece(2, 2)');
    }
}

function movePiece(rowOffset, colOffset) {
    vertMove = selectedPiece.pieceRow + rowOffset;
    horizMove = selectedPiece.pieceCol + colOffset;
    document.getElementById(selectedPiece.pieceId).remove();
    document.getElementById(`r${selectedPiece.pieceRow}c${selectedPiece.pieceCol}`).innerHTML = '';
    if (turn === 1) {
        if (selectedPiece.king) {
            document.getElementById(`r${vertMove}c${horizMove}`).innerHTML = `<span class="black-piece king" id="${selectedPiece.pieceId}"></p>`;
            blackPieceEls = document.querySelectorAll('span[class^="black"]')
            } else {
            document.getElementById(`r${vertMove}c${horizMove}`).innerHTML = `<span class="black-piece" id="${selectedPiece.pieceId}"></p>`;
            blackPieceEls = document.querySelectorAll('span[class^="black"]')
        }
    } else {
        if (selectedPiece.king) {
            document.getElementById(`r${vertMove}c${horizMove}`).innerHTML = `<span class="red-piece king" id="${selectedPiece.pieceId}"></p>`;
            blackPieceEls = document.querySelectorAll('span[class^="red"]')
            } else {
            document.getElementById(`r${vertMove}c${horizMove}`).innerHTML = `<span class="red-piece" id="${selectedPiece.pieceId}"></p>`;
            blackPieceEls = document.querySelectorAll('span[class^="red"]')
        }
    }
    let rowOfPiece = selectedPiece.pieceRow; // assigned to variable, as the function doesnt work with the object properties passed through directly
    let colOfPiece = selectedPiece.pieceCol; // assigned to variable, as the function doesnt work with the object properties passed through directly
    if ((rowOffset === -2 && colOffset === -2) || (rowOffset === -2 && colOffset === 2)
    || (rowOffset === 2 && colOffset === -2) || (rowOffset === 2 && colOffset === 2)) {
        changeGameState(rowOfPiece, colOfPiece, vertMove, horizMove, (selectedPiece.pieceRow + (rowOffset/2)), (selectedPiece.pieceCol + (colOffset/2)));
    } else {
        changeGameState(selectedPiece.pieceRow, selectedPiece.pieceCol, vertMove, horizMove)   
    }
}

function changeGameState(row, col, changedRow, changedCol, pieceToGraveyardRow, pieceToGraveyardCol) {
    board[row][col] = null;
    board[changedRow][changedCol] = parseInt(selectedPiece.pieceId);
    if (turn === 1 && selectedPiece.pieceId >= 12 && changedRow === topRowNum) {
        document.getElementById(selectedPiece.pieceId).classList.add('king');
    }
    if (turn === -1 && selectedPiece.pieceId <= 11 && changedRow === botRowNum) {
        document.getElementById(selectedPiece.pieceId).classList.add('king');
    }
    if (pieceToGraveyardRow && pieceToGraveyardCol) {
        board[pieceToGraveyardRow][pieceToGraveyardCol] = null;
        if (turn === 1 && selectedPiece.pieceId >= 12) {
            squareEls[(0 * pieceToGraveyardRow) + (1 * pieceToGraveyardCol)].innerHTML = "";
            redScore--
        }
        if (turn === -1 && selectedPiece.pieceId <= 11) {
            squareEls[(0 * pieceToGraveyardRow) + (1 * pieceToGraveyardCol)].innerHTML = "";
            blackScore--
        }
    }
    resetSelectedPieceProperties();
    removeSquareOnclicks();
    checkWinner();
    turn *= -1;
    updateListenersOnPieces();
    render();
}

function updateListenersOnPieces() {
    if (turn === 1) {
        redPieceEls.forEach(redPiece => redPiece.removeEventListener('click', getPlayerPieces));
        blackPieceEls.forEach(blackPiece => blackPiece.addEventListener('click', getPlayerPieces))
    } 
    if (turn === -1) {
        blackPieceEls.forEach(blackPiece => blackPiece.removeEventListener('click', getPlayerPieces));
        redPieceEls.forEach(redPiece => redPiece.addEventListener('click', getPlayerPieces))
    }
}


function checkWinner() {
    if (blackScore === 0) {winner = 1};
    if (redScore === 0) {winner = -1};
}

