function toggleMenu() {
    var status = $("#menu-list").css("display");
    if(status == "none") {
        var newStatus = "block";
    } else {
        var newStatus = "none";
    }
    $("#menu-list").css("display", newStatus);
}

function showHelp() {
    $("#menu-list").css("display", "none");
    $("#help-section").css("display", "block");
}

function hideHelp() {
    $("#help-section").css("display", "none");
}