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

const difficulties = {"easy":4,"medium":5,"hard":6};

function setup(difficulty) {
    let columns = difficulties[difficulty];
    buildCardDeck(columns);

    $(".card-cell").html('<img class="card-image" src="assets/images/cardBack_red2.png" alt="back of card">')
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
    for(var x = 0; x < (columns * 4); x++) {
        var rand = Math.floor(Math.random() * limit);
        limit--;
        cardsChosen.push(deck.splice(rand,1)[0])
    }
}

$(document).ready(function() {
    setup("medium");
});