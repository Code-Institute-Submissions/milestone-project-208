// menu, volume, help etc

function toggleMenu() {
    let status = $("#menu-list").css("display");
    let newStatus = status == "none" ? "block" : "none";
    $("#menu-list").css("display", newStatus);
}

function showHelp() {
    $("#menu-list").css("display", "none");
    $("#help-section").css("display", "block");
}

function hideHelp() {
    $("#help-section").css("display", "none");
}

function reset() {
    setup(currentDifficulty);
}

function changeDifficulty(selected) {
    currentDifficulty = selected.value;
    setup(currentDifficulty);
}

// Game setup
const difficulties = {"easy":4,"medium":5,"hard":6};
var currentDifficulty = "medium";
var cardToCellMap;

function setup(difficulty) {
    let columns = difficulties[difficulty];
    let randomCards = buildCardDeck(columns);
    let cellIDs = buildCellIDs(columns);
    cardToCellMap = mapCardsToIDs(cellIDs, randomCards);
    var width = 100/columns;

    turns = 0;
    best = 0;
    matches = 0;
    $('#turns').html(turns);
    $('#matches').html(matches);

    $(".turnable").click(function() {
        turnCard($(this).attr("id"));
    });

    $(".card-cell").css("width", `${width}%`);
    $(".card-cell").children("div").html("");
}

function mapCardsToIDs(cellIDs, cards) {
    let cardToCellMap = {};
    let rand;
    let cardCount = cards.length;
    cards.forEach(function(card) {
        rand = Math.floor(Math.random() * cellIDs.length);
        cell1 = cellIDs.splice(rand,1)[0];
        rand = Math.floor(Math.random() * cellIDs.length);
        cell2 = cellIDs.splice(rand,1)[0];
        cardToCellMap[cell1] = card;
        cardToCellMap[cell2] = card;
    });

    return cardToCellMap;
}

function buildCellIDs(columns) {
    let IDs = [];
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
    for(let x = 0; x < ((columns * 4)/2); x++) {
        let rand = Math.floor(Math.random() * limit);
        limit--;
        cardsChosen.push(deck.splice(rand,1)[0])
    }
    return cardsChosen;
}

// game play
var faceUpCard = "";
var faceUpCell = "";
var turns = 0;
var best = 0;
var matches = 0;
var pause = false;

function turnCard(id) {
    if( id === faceUpCell || pause === true) {
        return;
    }
    let card = cardToCellMap[id];
    $(`#${id}`).children("div").html(`<img class="card-image" src="assets/images/face-cards/${card}.png" alt="${card}">`);

    if(faceUpCard === '') {
        faceUpCard = card;
        faceUpCell = id;
    } else {
        pause = true;
        setTimeout(function() { pause = false; }, 500);
        turns++;
        $('#turns').html(turns);
        if(faceUpCard === card)
        {
            matches++;
            $('#matches').html(matches);
            $(`#${id}`).off("click");
            $(`#${faceUpCell}`).off("click");
            giveFeedback(true);
            faceUpCard = '';
            faceUpCell = '';
        } else {
            giveFeedback(false);
            setTimeout(function() {
                $(`#${id}`).children("div").html("");
                $(`#${faceUpCell}`).children("div").html("");
                faceUpCard = '';
                faceUpCell = '';
            },500);
        }
    }
}

function giveFeedback(match) {
    var id = match === true ? "tick" : "redX";
    // audio files from https://kenney.nl/assets/interface-sounds
    var audioFile = match === true ? "confirmation_002" : "error_005";

    $(`#${id}`).css("display","block");
    setTimeout(function() { $(`#${id}`).css("display","none"); }, 1000);

    var audio = new Audio(`assets/audio/${audioFile}.ogg`);
    audio.play();
}

$(document).ready(function() {
    
    setup("medium");

});