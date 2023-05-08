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



/*----- state variables -----*/


/*----- cached elements  -----*/


/*----- event listeners -----*/


/*----- functions -----*/
init()


function render() {

};

