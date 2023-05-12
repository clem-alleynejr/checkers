/*----- constants -----*/
const SPAN = {
    'black': `<span class="black-piece"></span>`,
    'blackKing': `<span class="black-king"></span>`,
    'red': `<span class="red-piece"></span>`,
    'redKing': `<span class="red-king"></span>`,

}

class Piece {
    constructor(color, player, coordinates) {
        this.color = color;
        this.player = player;
        this.selected = false;
        this.king = false;
        this.coordinates = coordinates;
        this.moveCoordinates = [];
        this.mvDiagUpLeft = false;
        this.mvDiagUpRight = false;
        this.jumpDiagUpLeft = false;
        this.jumpDiagUpRight = false;
        this.mvDiagDownLeft = false;
        this.mvDiagDownRight = false;
        this.jumpDiagDownLeft = false;
        this.jumpDiagDownRight = false;
        this.canMove = false;
    }
}

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
const changePieceEl = document.getElementById('change-piece')
const endTurnBtnEl = document.getElementById('end-turn')
const boardEl = document.getElementById("board");
const playAgainBtnEl = document.getElementById('play-again')
const redGraveyardEls = document.querySelectorAll('#red-graveyard > div')
const blackGraveyardEls = document.querySelectorAll('#black-graveyard > div')

/*----- event listeners -----*/
boardEl.addEventListener("click", function (evt) {
    selectedPiece ? handleMovePiece(evt) : handleClick(evt)
});
changePieceEl.addEventListener('click', resetSelectedPiece);
playAgainBtnEl


/*----- functions -----*/
init();

function init() {
    board = [
        [null, -1, null, -1, null, -1, null, -1],
        [-1, null, -1, null, -1, null, -1, null],
        [null, -1, null, -1, null, -1, null, -1],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [1, null, 1, null, 1, null, 1, null],
        [null, 1, null, 1, null, 1, null, 1],
        [1, null, 1, null, 1, null, 1, null],
    ];
    turn = 1;
    blackScore = 12;
    redScore = 12;
    winner = null;
    selectedPiece = null;
    blackGraveyard = [];
    redGraveyard = [];
    setBoard()
    getAvailMoves();
    render();
};

function setBoard() {
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] === 1) board[r][c] = new Piece("black", 1, [r, c]);
            if (board[r][c] === -1) board[r][c] = new Piece("red", -1, [r, c]);
        }
    }
}

function render() {
    renderBoard();
    renderRedGraveYard();
    renderBlackGraveYard();
    if (winner) {
        if (winner === 1) {messageEl.innerHTML = '<span style="color: black">BLACK WINS!</span>'};
        if (winner === -1) {messageEl.innerHTML = '<span style="color: red">RED WINS!</span>'};
    } else {
        if (turn === 1) {messageEl.innerHTML = '<span style="color: black">BLACK\'s TURN</span>'};
        if (turn === -1) {messageEl.innerHTML = '<span style="color: red">RED\'s TURN</span>'};
    }
    // winner ?
    // messageEl.innerHTML = `<span style="color: ${COLORS[winner].color}">${COLORS[winner].color} Wins!</span>`
    // :
    // messageEl.innerHTML = `<span style="color: ${COLORS[turn].color}">${COLORS[turn].color}'s Turn</span>`
    playAgainBtnEl.style.visibility = winner ? 'visible' : 'hidden';
    changePieceEl.style.visibility = selectedPiece ? 'visible' : 'hidden';
};

function renderRedGraveYard() {
        i = 0
        redGraveyard.forEach(redGrave => {
            redGraveyardEls[i].innerHTML = '<span class="red-piece"></span>'
            i++
        })
};

function renderBlackGraveYard() {
        i = 0
        blackGraveyard.forEach(blackGrave => {
            blackGraveyardEls[i].innerHTML = '<span class="black-piece"></span>'
            i++
        })
};

function renderBoard() {
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            const sqEl = document.getElementById(`r${r}c${c}`);
            // sqEl.style.border = 'none';
            if (board[r][c]) {
                if (board[r][c].king && board[r][c].color === "red") {
                    sqEl.innerHTML = SPAN['redKing']
                } else if (board[r][c].king && board[r][c].color === "black") {
                    sqEl.innerHTML = SPAN['blackKing']
                } else {
                    sqEl.innerHTML = SPAN[board[r][c].color];
                }
                // if (board[r][c].king && board[r][c].color === "black") sqEl.classList.add('black-king')
            }
            if (!board[r][c]) sqEl.innerHTML = "";
        }
    }
}


function getPlayerPieces(evt) {
    console.log(evt);
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


function handleClick(evt) {
    let row, col;
    if (evt.target.tagName === "SPAN") {
        row = evt.target.parentElement.id[1];
        col = evt.target.parentElement.id[3];
    } else {
        row = evt.target.id[1];
        col = evt.target.id[3];
    }
    getAvailMoves(row, col);
    if (!board[row][col] ||
        board[row][col].player !== turn ||
        !board[row][col].canMove ||
        board[row][col].moveCoordinates.length === 0 ||
        winner) return;
        
        selectedPiece = board[row][col];
        selectedPiece.selected = true;
        console.log(squareEls[parseInt(row*8) + parseInt(col)])
        squareEls[parseInt(row*8) + parseInt(col)].style.border = '3px dotted green';
    // winner = checkWinner();
    render()
}

function resetSelectedPiece(evt) {
    squareEls.forEach(SquareEl => SquareEl.style.border = '')
    // document.querySelectorAll('#board > div:hover').style.border = '0.25vmin solid blue'
    selectedPiece = null;
    render();
}

function getAvailMoves() {
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] === null) continue;
            board[r][c].moveCoordinates = [];
            let colorToFind = {
                "black": "red",
                "red": "black"
            }
            if (board[r][c].color === "black" || board[r][c].king) board[r][c].mvDiagUpLeft = checkDiagUpLeft(r - 1, c - 1)
            if (board[r][c].color === "black" || board[r][c].king) board[r][c].mvDiagUpRight = checkDiagUpRight(r - 1, c + 1);
            if (board[r][c].color === "black" || board[r][c].king) board[r][c].jumpDiagUpLeft = checkJumpDiagUpLeft(r - 2, c - 2, colorToFind[board[r][c].color]);
            if (board[r][c].color === "black" || board[r][c].king) board[r][c].jumpDiagUpRight = checkJumpDiagUpRight(r - 2, c + 2, colorToFind[board[r][c].color]);
            if (board[r][c].color === "red" || board[r][c].king) board[r][c].mvDiagDownLeft = checkDiagDownLeft(r + 1, c - 1);
            if (board[r][c].color === "red" || board[r][c].king) board[r][c].mvDiagDownRight = checkDiagDownRight(r + 1, c + 1);
            if (board[r][c].color === "red" || board[r][c].king) board[r][c].jumpDiagDownLeft = checkJumpDiagDownLeft(r + 2, c - 2, colorToFind[board[r][c].color]);
            if (board[r][c].color === "red" || board[r][c].king) board[r][c].jumpDiagDownRight = checkJumpDiagDownRight(r + 2, c + 2, colorToFind[board[r][c].color]);
            if (board[r][c].mvDiagUpLeft || board[r][c].mvDiagUpRight || board[r][c].jumpDiagUpLeft || board[r][c].jumpDiagUpRight ||
                board[r][c].mvDiagDownLeft || board[r][c].mvDiagDownRight || board[r][c].jumpDiagDownLeft || board[r][c].jumpDiagDownRight) board[r][c].canMove = true;
        }
    }
}

function checkBoundaries(row, col) {
    if (row < 0 || row > board.length - 1 || col < 0 || col > board[row].length - 1) return true;
    return false;
}

function checkDiagUpLeft(row, col) {
    if (checkBoundaries(row, col)) return false;
    if (board[row][col] !== null) return false;
    board[row + 1][col + 1].moveCoordinates.push([row, col]);
    return true;
}

function checkDiagUpRight(row, col) {
    if (checkBoundaries(row, col)) return false;
    if (board[row][col] !== null) return false;
    board[row + 1][col - 1].moveCoordinates.push([row, col]);
    return true;
}

function checkJumpDiagUpLeft(row, col, colorToFind) {
    if (checkBoundaries(row, col)) return false;
    if (board[row][col] !== null) return false;
    if (board[row + 1][col + 1] === null) return false;
    if (board[row + 1][col + 1].color !== colorToFind) return false;
    board[row + 2][col + 2].moveCoordinates.push([row, col]);
    return true;
}

function checkJumpDiagUpRight(row, col, colorToFind) {
    if (checkBoundaries(row, col)) return false;
    if (board[row][col] !== null) return false;
    if (board[row + 1][col - 1] === null) return false;
    if (board[row + 1][col - 1].color !== colorToFind) return false;
    board[row + 2][col - 2].moveCoordinates.push([row, col]);
    return true;
}

function checkDiagDownLeft(row, col) {
    if (checkBoundaries(row, col)) return false;
    if (board[row][col] !== null) return false;
    board[row - 1][col + 1].moveCoordinates.push([row, col]);
    return true;
}

function checkDiagDownRight(row, col) {
    if (checkBoundaries(row, col)) return false;
    if (board[row][col] !== null) return false;
    board[row - 1][col - 1].moveCoordinates.push([row, col]);
    return true;
}

function checkJumpDiagDownLeft(row, col, colorToFind) {
    if (checkBoundaries(row, col)) return false;
    if (board[row][col] !== null) return false;
    if (board[row - 1][col + 1] === null) return false;
    if (board[row - 1][col + 1].color !== colorToFind) return false;
    board[row - 2][col + 2].moveCoordinates.push([row, col]);
    return true;
}

function checkJumpDiagDownRight(row, col, colorToFind) {
    if (checkBoundaries(row, col)) return false;
    if (board[row][col] !== null) return false;
    if (board[row - 1][col - 1] === null) return false;
    if (board[row - 1][col - 1].color !== colorToFind) return false;
    board[row - 2][col - 2].moveCoordinates.push([row, col]);
    return true;
}

function handleMovePiece(evt) {
    if (selectedPiece === null || !selectedPiece.canMove) return;
    let row, col;
    if (evt.target.tagName === "SPAN") {
        row = parseInt(evt.target.parentElement.id[1]);
        col = parseInt(evt.target.parentElement.id[3]);
    } else {
        row = parseInt(evt.target.id[1]);
        col = parseInt(evt.target.id[3]);
    }

    for (let i = 0; i < selectedPiece.moveCoordinates.length; i++) {
        let pieceMoveRow = selectedPiece.moveCoordinates[i][0];
        let pieceMoveCol = selectedPiece.moveCoordinates[i][1];
        let jump = false;

        if (pieceMoveRow === parseInt(row) && pieceMoveCol === parseInt(col)) {
            if (Math.abs(selectedPiece.coordinates[0] - pieceMoveRow) + Math.abs(selectedPiece.coordinates[1] - pieceMoveCol) === 4) jump = true;
            if (jump) {
                removeRow = (selectedPiece.coordinates[0] - pieceMoveRow) / 2;
                removeCol = (selectedPiece.coordinates[1] - pieceMoveCol) / 2;
                console.log(removeRow + row, removeCol + col);
                let lostPiece = board[row + removeRow][col + removeCol];
                board[row + removeRow][col + removeCol] = null;
                if (lostPiece.color === "red") {
                    redScore--;
                    redGraveyard.push(lostPiece);
                }
                if (lostPiece.color === "black") {
                    blackScore--;
                    blackGraveyard.push(lostPiece);
                };
            }
            board[selectedPiece.coordinates[0]][selectedPiece.coordinates[1]] = null;
            selectedPiece.selected = false;
            selectedPiece.coordinates = [row, col];
            board[row][col] = selectedPiece;
            if (selectedPiece.color === "black" && row === 0) {
                selectedPiece.king = true;
            }
            if (selectedPiece.color === "red" && row === 7) selectedPiece.king = true;
            selectedPiece = null;
            turn *= -1;
            break;
        }
    }
    getAvailMoves();
    squareEls.forEach(SquareEl => SquareEl.style.border = '');
    checkWinner();
    render();
}

function checkWinner() {
    if (blackScore === 0) { winner = -1 };
    if (redScore === 0) { winner = 1 };
}