function toggleMenu() {
    var status = $("#menu-list").css("display");
    var newStatus = status == "none" ? "block" : "none";
    $("#menu-list").css("display", newStatus);
}

function showHelp() {
    $("#menu-list").css("display", "none");
    $("#help-section").css("display", "block");
}

function hideHelp() {
    $("#help-section").css("display", "none");
}

function setup() {
    $(".card-cell").html('<img class="card-image" src="assets/images/cardBack_red2.png" alt="back of card">')
}
$(document).ready(function() {
    setup();
});