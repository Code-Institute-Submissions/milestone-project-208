function toggleMenu() {
    var status = $("#menu-list").css("display");
    console.log(status);
    if(status == "none") {
        var newStatus = "block";
    } else {
        var newStatus = "none";
    }
    $("#menu-list").css("display", newStatus);
}