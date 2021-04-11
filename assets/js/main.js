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

// Game setup
const difficulties = {"easy":4,"medium":5,"hard":6};
var difficulty = "medium";
var cardToCellMap;

function setup(difficulty) {
    let columns = difficulties[difficulty];
    let randomCards = buildCardDeck(columns);
    let cellIDs = buildCellIDs(columns);
    cardToCellMap = mapCardsToIDs(cellIDs, randomCards);

    $(".card-cell").html('<img class="card-image" src="assets/images/cardBack_red2.png" alt="back of card">');
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
        for(let y = 0; y < columns; y++){
            IDs.push(`r${x}c${y}`);
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

function turnCard(id) {
    let card = cardToCellMap[id];

    
    $(`#${id}`).html(`<img class="card-image" src="assets/images/face-cards/${card}.png" alt="back of card">`);
}

$(document).ready(function() {
    setup("medium");

    $(".turnable").click(function() {
        turnCard($(this).attr("id"));
    });
});