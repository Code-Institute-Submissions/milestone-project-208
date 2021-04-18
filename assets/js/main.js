// --------- menu, volume, help etc ---------
// toggles the menu visibility
function toggleMenu() {
    let status = $("#menu-list").css("display");
    let newStatus = status == "none" ? "block" : "none";
    $("#menu-list").css("display", newStatus);
}

// shows help section and hides the menu and card table
function showHelp() {
    $("#menu-list").css("display", "none");
    $("#help-section").css("display", "block");
    $(".card-table").css("display", "none");
}

// hides the menu and shows the card table
function hideHelp() {
    $("#help-section").css("display", "none");
    $(".card-table").css("display", "table");
}

// checks if a player is in the middle of a game and asks for comnfirmation if necessary before resetting the game
function reset() {
    if(turns > 0 && win === false) {
        if(!confirm("Are you sure? You'll lose progress in your current game")) {
            return;
        }
    }
    $("#menu-list").css("display", "none");
    setup(currentDifficulty);
}

// checks if a player is in the middle of a game and asks for comnfirmation if necessary before changing the difficulty and resetting the game
function changeDifficulty(selected) {
    if(turns > 0 && win === false) {
        if(!confirm("Are you sure? You'll lose progress in your current game")) {
            return;
        }
    }
    $("#menu-list").css("display", "none");
    currentDifficulty = selected.value;
    setup(currentDifficulty);
}

// toggles the volume on and off
function toggleVolume() {
    if(!volume) {
        $('.volume').html('<i class="fa fa-volume-up"></i>');
        volume = true;
    } else {
        $('.volume').html('<i class="fa fa-volume-off"></i>');
        volume = false;
    }
}

// --------- Game setup ---------
// declare variables needed in multiple functions
const difficulties = {"easy":4,"medium":5,"hard":6};
var currentDifficulty = "medium";
var cardToCellMap;
var volume = true;
var win;
var turns;
var matches;

// takes difficulty as an argument and sets up new game
function setup(difficulty) {
    // make sure all sections are shown/hidden as appropriate
    $("#help-section").css("display", "none");
    $("#win-section").css("display", "none");
    $(".card-table").css("display", "table");
    // sets variables required for this function to create a new game
    win = false;
    let columns = difficulties[difficulty];
    let randomCards = buildCardDeck(columns); // gets the required number of random cards
    let cellIDs = buildCellIDs(columns); // gets the active cells for the game based on difficulty
    cardToCellMap = mapCardsToIDs(cellIDs, randomCards); // randomly maps the cell ids to the cards
    var width = 100/columns; // sets the width based on number of columns

    // updates the score section
    turns = 0;
    matches = 0;
    $('#turns').html(turns);
    $('#matches').html(matches);

    // adds a click listener to elements with the turnable class
    $(".turnable").click(function() {
        turnCard($(this).attr("id"));
    });

    // sets width of the card cells and removes any HTML inside. This removes HTML for any cards still showing from the previous game
    $(".card-cell").css("width", `${width}%`);
    $(".card-cell").children("div").html("");
}

function mapCardsToIDs(cellIDs, cards) {
    let cardToCellMap = {}; // create an empty object to be populated below
    let rand;
    // goes through each of the cards and randomly assigns it to a cell while removing the cell from the cellIDs array (to prevent duplicates)
    cards.forEach(function(card) {
        rand = Math.floor(Math.random() * cellIDs.length);
        var cell1 = cellIDs.splice(rand,1)[0];
        rand = Math.floor(Math.random() * cellIDs.length);
        var cell2 = cellIDs.splice(rand,1)[0];
        cardToCellMap[cell1] = card;
        cardToCellMap[cell2] = card;
    });

    return cardToCellMap;
}

function buildCellIDs(columns) {
    let IDs = [];
    // iterates through the row/column numbers and creates an array with the subsequent IDs. These relate to the card-table in the index.html file
    for(let x = 0; x < 4; x++){
        for(let y = 0; y < 6; y++){
            if(y > columns-1) {
                $(`#r${x}c${y}`).addClass("hidden");
            } else {
                $(`#r${x}c${y}`).removeClass("hidden");
                IDs.push(`r${x}c${y}`);
            }
            
        }
    }
    return IDs;
}

function buildCardDeck(columns) {
    // creates arrays with all possible values then combines them to make a 52 card deck
    let suits = ["Clubs","Diamonds","Hearts","Spades"];
    let values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
    let deck = [];
    suits.forEach(function(suit) {
        values.forEach(function(value) {
            deck.push(`card${suit}${value}`);
        });
    });
    let limit = 51;
    let cardsChosen = [];
    // randomly chooses the required number of cards from the 52 card deck
    for(let x = 0; x < ((columns * 4)/2); x++) {
        let rand = Math.floor(Math.random() * limit);
        limit--;
        cardsChosen.push(deck.splice(rand,1)[0]);
    }
    return cardsChosen;
}

// --------- game play ---------
// declare variables needed for gameplay
var faceUpCard = "";
var faceUpCell = "";
var best;
var pause = false;

// function that is called when you click on card
function turnCard(id) {
    // if statement prevents calling this function twice on the same card or clicking a third card quickly
    if( id === faceUpCell || pause === true) {
        return;
    }
    // gets the card name mapped to the cell you've clicked and displays the image for that card
    let card = cardToCellMap[id];
    $(`#${id}`).children("div").html(`<img class="card-image" src="assets/images/face-cards/${card}.png" alt="${card}">`);

    if(faceUpCard === '') {
        // if a card is not already face up, remember the cell and card value that is face up
        faceUpCard = card;
        faceUpCell = id;
    } else {
        // otherwise, set pause to true for half a second to prevent 3 clicks
        pause = true;
        setTimeout(function() { pause = false; }, 500);
        // update the number of turns taken variable and on screen
        turns++;
        $('#turns').html(turns);
        if(faceUpCard === card)
        {
            // if the cards match, update the number of matches, disable the click listener for those cards, show the tick icon and play a sound, and set the face up card cell/value to an empty string
            matches++;
            $('#matches').html(matches);
            $(`#${id}`).off("click");
            $(`#${faceUpCell}`).off("click");
            giveFeedback(true);
            faceUpCard = '';
            faceUpCell = '';
        } else {
            // otherwise, show the red x icon, play a buzz, and after half a second turn the cards back over. Also set the face up card cell/value to an empty string. This must be done after turning the cards over as the id and faceUpCell value are needed to do this
            giveFeedback(false);
            setTimeout(function() {
                $(`#${id}`).children("div").html("");
                $(`#${faceUpCell}`).children("div").html("");
                faceUpCard = '';
                faceUpCell = '';
            },500);
        }
    }
    // if the number of matches is the same as the number of columns * 2, then all cards have been matched
    if(matches === (difficulties[currentDifficulty] * 2)) {
        endGame();
    }
}

function endGame() {
    win = true; //used to determine if reset requires confirmation
    // Uses your score to determine the win text and updates the best score if required
    if(!Number.isInteger(best) || turns < best) {
        best = turns;
        $("#best").html(best);
        $("#win-text").html(`<br><br><p>Congrats! You set a new high score<br><br>Best: ${best}</p>`);
    } else if( (best/turns) > 0.8 ) {
        $("#win-text").html(`<br><br><p>So close to your best score, keep trying<br><br>Score: ${turns}<br>Best: ${best}</p>`);
    } else {
        $("#win-text").html(`<br><br><p>Well done, here's your score<br><br>Score: ${turns}<br>Best: ${best}</p>`);
    }
    if(volume) {
        // if volume is on, play a message
        var audio = new Audio(`assets/audio/you_win.ogg`);
        audio.play();
    }
    // shows the win section and hides the card table
    $("#win-section").css("display", "block");
    $(".card-table").css("display", "none");
}

function giveFeedback(match) {
    // check which image to show
    var id = match === true ? "tick" : "redX";
    // audio files from https://kenney.nl/assets/interface-sounds

    // show the image for a second
    $(`#${id}`).css("display","block");
    setTimeout(function() { $(`#${id}`).css("display","none"); }, 1000);

    if(volume) {
        // play relevant sound for match/miss
        var audioFile = match === true ? "confirmation_002" : "error_005";
        var audio = new Audio(`assets/audio/${audioFile}.ogg`);
        audio.play();
    }
}

$(document).ready(function() {
    // used to set up the game once the page has loaded
    setup("medium");

});