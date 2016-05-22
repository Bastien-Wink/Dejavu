function scrollLoad() {
    $("body").css("opacity", 0.2);
    $("body").css("background", "white");

    window.scrollTo(0, document.body.scrollHeight);
    var x = 0;
    var intervalID = setInterval(function() {
        window.scrollTo(0, document.body.scrollHeight);
        if (++x === 10) {
            window.clearInterval(intervalID);
            window.scrollTo(0, 0);
            $("body").css("opacity", 1);
        }
    }, 10);
}
